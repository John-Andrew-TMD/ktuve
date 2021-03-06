<template>
  <div>
    <el-dialog
      width="1000px"
      :modal-append-to-body="false"
      title="编辑客户附件资料"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <el-customer-transfer
        ref="transferDom"
        v-model="selectedAttach"
        title="资料内容"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入关键字"
        :data="attachmentData"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDictItems } from 'utils'
import { attachmentCustAttachAdd, attachmentList } from 'api/run-module/attachment-setting.js'
import ElCustomerTransfer from './transfer/index.vue'
import { requestPost } from 'utils/fetch.js'
export default {
  components: {
    ElCustomerTransfer
  },
  props: {
    selectedRow: {
      type: Object,
      default: null
    },
    tableData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        {
          type: 'radio',
          title: '客户类型',
          field: 'custCategory',
          value: '1',
          options: queryDictItems('10008'),
          validate: this.formValidate({ required: true }),
          on: {
            change: this.handleCustCategoryChange
          }
        }
        // {
        //   type: 'checkbox',
        //   title: '资料内容',
        //   field: 'enclosureId',
        //   options: [],
        //   validate: this.formValidate({ required: true })
        // }
      ],
      formOptions: {
        form: { labelWidth: '85px' },
        submitBtn: { show: false }
      },
      attachmentData: [],
      selectedAttach: []
    }
  },
  created() {
    this.getAttachmentTypeList()
  },
  mounted() {
    this.dialogVisible = true
    this.$nextTick(() => {
      this.initUI()
    })
  },
  methods: {
    getAttachmentTypeList() {
      requestPost(attachmentList, {
        dto: {},
        pageCurrent: 1,
        pageSize: 10000
      }).then(res => {
        if (res.data && Array.isArray(res.data.records)) {
          // 排除系统固定附件内容
          const ret = res.data.records.filter(item => item.systemFixation !== '1')
          this.attachmentData = ret.map(item => {
            return {
              enclosureId: item.id,
              dataContent: item.dataContent
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    initUI() {
      if (!this.selectedRow) return
      const { custCategory } = this.selectedRow
      this.formApi.setValue('custCategory', custCategory)
      this.selectedAttach = this.selectedRow.sourceData.map(item => item.enclosureId)
      this.$refs.transferDom.setTableData(this.selectedRow.sourceData)
    },
    handleCustCategoryChange() {
      const { custCategory } = this.formApi.formData()
      if (this.tableData.length) {
        const res = this.tableData.filter(item => item.custCategory === custCategory)[0] || []
        this.$refs.transferDom.setTableData([])
        this.$nextTick(() => {
          this.$refs.transferDom.setTableData(res.sourceData)
        })
      }
    },
    handleDialogConfirm() {
      const tableData = this.$refs.transferDom.getTableData()
      if (!tableData.length) return this.$showToast('资料内容选择数量不允许为空！')
      this.formApi.validate(async valid => {
        if (valid) {
          let params = this.formApi.formData()
          params = tableData.map((item, index) => {
            return {
              ...params,
              enclosureId: item.enclosureId,
              dataContent: item.dataContent,
              displayOrder: index,
              isNecessary: item.isNecessary !== '1' ? '0' : '1'
            }
          })
          attachmentCustAttachAdd(params, { showLoading: true }).then(res => {
            this.$showToast('编辑成功！', 'success')
            this.dialogVisible = false
            this.$emit('dialog-confirm')
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    filterMethod(query, item) {
      return item.dataContent.indexOf(query) > -1
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog {
  .el-checkbox {
    display: block;
  }
}

</style>
