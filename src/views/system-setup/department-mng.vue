<template>
  <div class="app-content department-mng-page">
    <div class="content">
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleBtnGroupClick('add')">新增</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="!rowData"
          @click="handleBtnGroupClick('edit')"
        >修改</el-button>
        <el-button
          type="danger"
          size="mini"
          :disabled="!rowData"
          @click="handleBtnGroupClick('delete')"
        >删除</el-button>
      </div>
      <el-table
        v-loading="showTableLoading"
        v-el-height-adaptive-table="{bottomOffset: 20}"
        :data="tableData"
        size="small"
        border
        default-expand-all
        element-loading-text="正在拼命加载中..."
        highlight-current-row
        row-key="orgname"
        style="margin-top: 12px"
        @row-click="handleRowClick"
      >
        <el-table-column prop="orgname" label="部门名称" width="230" align="left">
          <template slot-scope="scope">
            <i
              class="iconfont"
              :class="scope.row.orglevel === '3' ? 'icon-file' : 'icon-folder-close'"
            />
            {{ scope.row.orgname }}
          </template>
        </el-table-column>
        <el-table-column prop="orgid" label="部门代码" />
        <el-table-column prop="parentorgname" label="父部门" />
        <el-table-column prop="parentorgid" label="父部门代码" />
        <el-table-column prop="addr" label="网点地址" />
        <el-table-column prop="principalman" label="负责人" />
        <el-table-column prop="mobilno" label="手机号码" />
      </el-table>
      <el-dialog
        :title="dialogTitle[action]"
        :visible.sync="showDialog"
        width="480px"
        :modal-append-to-body="false"
        @closed="handleDialogClosed"
      >
        <el-form
          ref="formDom"
          :model="formItems"
          :rules="formRules"
          label-width="80px"
          size="medium"
        >
          <el-form-item label="父级部门" prop="parentorgid">
            <el-cascader
              v-model="formItems.parentorgid"
              :options="tableData"
              style="width: 100%"
              :props="props"
              :show-all-levels="false"
              :disabled="!!rowData"
            />
          </el-form-item>
          <el-form-item label="部门代码" prop="orgid">
            <el-input v-model.trim="formItems.orgid" maxlength="16" :disabled="!!rowData" />
          </el-form-item>
          <el-form-item label="部门名称" prop="orgname">
            <el-input v-model.trim="formItems.orgname" maxlength="32" />
          </el-form-item>
          <el-form-item label="网点地址" prop="addr">
            <el-input v-model.trim="formItems.addr" />
          </el-form-item>
          <el-form-item label="联系人" prop="linkman">
            <el-input v-model.trim="formItems.linkman" maxlength="16" />
          </el-form-item>
          <el-form-item label="电话号码" prop="telephone">
            <el-input v-model.trim="formItems.telephone" maxlength="13" />
          </el-form-item>
          <el-form-item label="负责人" prop="principalman">
            <el-input v-model.trim="formItems.principalman" maxlength="16" />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobilno">
            <el-input v-model.trim="formItems.mobilno" maxlength="11" />
          </el-form-item>
          <el-form-item label="邮编" prop="postcode">
            <el-input v-model.trim="formItems.postcode" maxlength="6" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog=false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { generateTree } from 'utils'
export default {
  // name: "DepartmentMng",
  data() {
    return {
      tableData: [],
      showTableLoading: true,
      dialogTitle: {
        A: '部门新增',
        U: '部门修改'
      },
      formItems: {
        parentorgid: [],
        orgid: '',
        orgname: '',
        addr: '',
        linkman: '',
        telephone: '',
        principalman: '',
        mobilno: '',
        postcode: ''
      },
      formRules: {
        parentorgid: this.formValidate({ required: true }),
        orgid: this.formValidate({
          required: true,
          validator: {
            regexp: /^[A-Za-z0-9]+$/,
            message: '部门代码只能包含数字和字母'
          }
        }),
        orgname: this.formValidate({ required: true }),
        telephone: this.formValidate({ type: 'tel' }),
        mobilno: this.formValidate({ type: 'mobile' }),
        postcode: this.formValidate({ type: 'post' })
      },
      props: {
        value: 'orgid',
        label: 'orgname',
        checkStrictly: true
      },
      showDialog: false,
      rowData: null,
      action: 'A'
    }
  },
  created() {
    this._getDepartmentData()
  },
  methods: {
    _getDepartmentData() {
      this.showTableLoading = true
      this.$promiseRequest({
        code: '100200',
        data: {}
      })
        .then(res => {
          if (res.data.record.length) {
            this.tableData = Object.freeze(
              generateTree(res.data.record, '0001', 'orgid', 'parentorgid')
            )
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(res => {
          this.showTableLoading = false
        })
    },
    handleBtnGroupClick(action) {
      switch (action) {
        case 'add':
          this.action = 'A'
          this.showDialog = true
          break
        case 'edit':
          this.action = 'U'
          this.showDialog = true
          this.$nextTick(() => {
            Object.keys(this.formItems).forEach(key => {
              this.formItems[key] = this.rowData[key]
            })
            this.formItems.parentorgid = [this.formItems.parentorgid]
          })
          break
        case 'delete':
          this._handleDepartmentDelete()
          break
      }
    },
    handleDialogConfirm() {
      this.$refs.formDom.validate(async valid => {
        if (valid) {
          this.$promiseRequest(
            {
              code: '100350',
              data: {
                action: this.action,
                investorg: '0',
                ...this.formItems,
                ...{ parentorgid: this.formItems.parentorgid[0] }
              },
              opts: {
                permission: this.action === 'A' ? '111300001' : '111300002'
              },
              act: {
                menu_id: this.action === 'A' ? '111300001' : '111300002'
              }
            },
            { showLoading: true }
          )
            .then(res => {
              this.showDialog = false
              this.$showToast(res.data.result.prompt, 'success')
              this._getDepartmentData()
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    _handleDepartmentDelete() {
      this.$confirm('确定删除选中的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$promiseRequest({
            code: '100350',
            data: {
              action: 'D',
              ...this.rowData
            },
            opts: {
              permission: '111300003'
            },
            act: {
              menu_id: '111300003'
            }
          })
            .then(res => {
              this.$showToast(res.data.result.prompt, 'success')
              this._getDepartmentData()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleRowClick(row) {
      this.rowData = row
    },
    handleDialogClosed() {
      this.$refs.formDom.resetFields()
    }
  }
}
</script>
<style lang="scss">
.department-mng-page {
  .el-table__body {
    .iconfont {
      margin-right: 1px;
      font-size: 14px;
      vertical-align: -1px;
      color: #67A3F4;
    }
  }
}

</style>
