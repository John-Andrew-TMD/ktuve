<template>
  <div>
    <el-dialog
      width="1000px"
      :modal-append-to-body="false"
      title="编辑项目附件资料"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <el-customer-transfer
        ref="transferDom"
        v-model="selectedAttach"
        from="projectModule"
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
import { attachmentProjectAttachAdd, attachmentList } from 'api/run-module/attachment-setting.js'
import { queryDictItems } from 'utils'
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
          title: '租赁类型',
          field: 'businessType',
          options: queryDictItems('10047'),
          on: {
            change: this.handleSelectChange
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'radio',
          title: '资料分类',
          field: 'dataType',
          options: queryDictItems('10048'),
          on: {
            change: this.handleSelectChange
          },
          validate: this.formValidate({ required: true })
        }
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
    initUI() {
      if (!this.selectedRow) return
      const { businessType, dataType } = this.selectedRow
      this.formApi.setValue({
        businessType,
        dataType
      })
      this.selectedAttach = this.selectedRow.sourceData.map(item => item.enclosureId)
      this.$refs.transferDom.setTableData(this.selectedRow.sourceData)
    },
    handleSelectChange() {
      const { businessType, dataType } = this.formApi.formData()
      if (this.tableData.length) {
        const res = this.tableData.filter(item => item.businessType === businessType && item.dataType === dataType)[0] || []
        this.$refs.transferDom.setTableData([])
        this.$nextTick(() => {
          this.$refs.transferDom.setTableData(res.sourceData)
        })
      }
    },
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
              approvalFlag: item.approvalFlag !== '1' ? '0' : '1',
              responsibleFlag: item.responsibleFlag !== '1' ? '0' : '1'
            }
          })
          attachmentProjectAttachAdd(params, { showLoading: true }).then(res => {
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
