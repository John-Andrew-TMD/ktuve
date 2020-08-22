<template>
  <div class="stockholder-info-comp">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">担保信息</span>
        <div v-if="routeParams.canEdit" class="panel-tools">
          <el-button type="primary" @click="handleAddClick()">添加</el-button>
        </div>
      </div>
    </div>
    <div class="content-body">
      <el-form
        ref="formDom"
        class="stockholder-info-table-comp"
        :show-message="false"
        :model="formItems"
        style="margin-top: 10px"
        @submit.native.prevent
      >
        <el-table ref="tableDom" :data="formItems.tableData" border style="width: 100%">
          <el-table-column
            v-for="(rule,index,key) in rules"
            :key="key"
            :prop="rule.field"
            :label="rule.title"
            :resizable="false"
            show-overflow-tooltip
          >
            <template slot-scope="{row,$index}">
              <template v-if="row.showEdit">
                <el-form-item
                  v-if="rule.type!='hidden'"
                  :prop="`tableData.${$index}.${rule.field}`"
                  :rules="rule.validate"
                >
                  <template v-if="(rule.field=='guarantorName')">
                    <el-custom-select
                      v-model="row[rule.field]"
                      clearable
                      filterable="true"
                      :params="guarantorNameParams"
                      size="mini"
                      @change="obj => handleBlocNameChange(obj, $index)"
                    />
                  </template>
                  <template v-else-if="rule.field=='method'">
                    <el-select v-model="row[rule.field]" placeholder="请选择">
                      <el-option
                        v-for="(item, index) in rule.options"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                  <template
                    v-else-if="(rule.field=='guaranteeAmount')||(rule.field=='guaranteeBalance')"
                  />
                  <template v-else>
                    <el-input v-model="row[rule.field]" size="mini" />
                  </template>
                </el-form-item>
              </template>
              <template v-else>
                <span v-if="rule.field=='method'">{{ row[rule.field]|filterDictValue(10038) }}</span>
                <span v-else>{{ row[rule.field] }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            width="220px"
            label="操作"
            header-align="center"
            fixed="right"
            :resizable="false"
          >
            <div slot-scope="{row,$index}" class="action-template">
              <template v-if="routeParams.canEdit">
                <el-button
                  v-if="row.showBtn"
                  type="primary"
                  size="mini"
                  :loading="false"
                  @click.native="handleUpdate($index, row)"
                >保存</el-button>
                <el-button
                  v-if="row.showBtn"
                  type="primary"
                  size="mini"
                  @click.native="handleCancel($index, row)"
                >取消</el-button>
                <el-button
                  v-if="!row.showBtn"
                  type="primary"
                  size="mini"
                  @click.native="handleEdit($index, row)"
                >编辑</el-button>
              </template>
              <el-button v-if="row.id" size="mini" type="primary" @click="handleDetailClick(row)">详情</el-button>
              <template v-if="routeParams.canEdit">
                <el-button
                  v-if="row.id&&!row.showBtn"
                  type="primary"
                  size="mini"
                  @click.native="handleDeleteClick($index,row)"
                >删除</el-button>
              </template>
            </div>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import {
  getGuaranteeListByRecordId,
  guaranteeListByRecordId,
  saveOrUpdateBatch,
  amountByGuarantorId,
  removeByIds,
  addGuarantee
} from 'api/project-module/api-project-guarantee.js'
import { queryDictItems } from 'utils'
import { showToast } from 'utils'
import { customerList } from 'api/customer-module/api-customer-mng.js'
import { getCustomerById } from 'api/customer-module/api-customer-detail.js'
export default {
  components: {
    TableCreate
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      action: 'A',
      formItems: {
        tableData: []
      },
      formStatus: {
        showEdit: false,
        showBtn: false,
        rules: {
          guarantorName: {
            status: false,
            msg: '请输入担保方'
          },
          method: {
            status: false,
            msg: '请输入担保方式'
          }
        }
      },
      rowOldForm: [],
      guarantorNameParams: {
        url: customerList,
        data: {
          custAttribute: '1263390926343389186,1263391075484450817',
          blacklistState: '1'
        },
        searchKey: 'custName',
        labelKey: 'custName',
        valueKey: 'custName',
        repeat: false
      },
      rules: [
        {
          type: 'el-custom-select',
          title: '担保方',
          field: 'guarantorName',
          'show-overflow-tooltip': true,
          validate: this.formValidate({ required: true })
        },
        {
          title: '担保总额',
          field: 'guaranteeAmount'
        },
        {
          title: '担保余额',
          field: 'guaranteeBalance'
        },
        {
          type: 'select',
          title: '担保方式',
          field: 'method',
          options: queryDictItems('10038'),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-input',
          title: '抵押物/质押物',
          field: 'goods'
        },
        {
          type: 'el-input',
          title: '项目担保方案',
          field: 'guaranteeScheme',
          'show-overflow-tooltip': true,
          props: {
            type: 'textarea'
          }
        }
      ],
      queryDictItems
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable() {
      this.getTableData()
    },
    getTableData() {
      getGuaranteeListByRecordId(
        {
          recordId: this.routeParams.id
        },
        { showLoading: true }
      )
        .then(res => {
          this.formItems.tableData = res.data.records.map(item => {
            return { ...item, ...this.formStatus }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleEdit(index, row) {
      row.showEdit = true
      row.showBtn = true
      this.rowOldForm[index] = { ...row }
    },
    handleCancel(index, row) {
      if (row.id) {
        this.cancelStatus(index)
      } else {
        this.formItems.tableData.splice(index, 1)
      }
    },
    cancelStatus(index) {
      this.rowOldForm[index].showEdit = false
      this.rowOldForm[index].showBtn = false
      this.formItems.tableData[index] = this.rowOldForm[index]
      this.$set(this.formItems.tableData, index, this.rowOldForm[index])
    },
    handleBlocNameChange(obj, index) {
      amountByGuarantorId({ id: obj.data.id }).then(res => {
        this.formItems.tableData[index].guarantorId = obj.data.id
      })
    },
    handleDetailClick(data) {
      getCustomerById(
        {
          id: data.guarantorId
        },
        { showLoading: true }
      )
        .then(res => {
          this.$router.push({
            path: '/customer-mng/customer-detail',
            query: {
              id: data.guarantorId
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDeleteClick($index, data) {
      const ids = [data.id]
      if (!ids.length) {
        return this.$showToast('请选择一条担保信息进行删除', 'warning')
      }
      this.$confirm('确定删除该担保信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeByIds({ ids: ids }, { showLoading: true })
            .then(res => {
              this.formItems.tableData.splice($index, 1)
              this.$showToast('删除成功', 'success')
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleAddClick() {
      this.formItems.tableData.push({
        guarantorId: null,
        id: null,
        guarantorName: '',
        method: '',
        guaranteeAmount: '',
        guaranteeBalance: '',
        goods: '',
        guaranteeScheme: '',
        showEdit: true,
        showBtn: true,
        rules: {
          guarantorName: {
            status: false,
            msg: '请输入担保方'
          },
          method: {
            status: false,
            msg: '请输入担保方式'
          }
        }
      })
    },
    handleDialogClosed() {
      this.form.resetFields()
    },
    validateFieldRow(field) {
      return new Promise(resolve => {
        this.$refs['formDom'].validateField(field, err => {
          resolve(err)
        })
        resolve()
      })
    },
    handleUpdate($index, row) {
      const p1 = this.validateFieldRow(`tableData.${$index}.guarantorName`)
      const p2 = this.validateFieldRow(`tableData.${$index}.method`)
      Promise.all([p1, p2]).then(result => {
        if (!result.join('')) {
          const data = this.formItems.tableData[$index]
          data.action = this.action
          data.recordId = this.routeParams.id
          data.location = '1'
          delete data.rules
          delete data.action
          if (!row.id) {
            delete data.id
            addGuarantee(data, { showLoading: true })
              .then(res => {
                const data = { ...res.data, ...this.formStatus }
                this.formItems.tableData[$index] = data
                this.$set(this.formItems.tableData, $index, data)
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            saveOrUpdateBatch([data], { showLoading: true })
              .then(res => {
                this.formItems.tableData[$index].showEdit = false
                this.formItems.tableData[$index].showBtn = false
                // this.cancelStatus($index);
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.stockholder-info-comp /deep/  {
  .el-tabs {
    height: 40px;
    padding: 0 10px;
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__content {
      display: block;
    }
  }
}

</style>
