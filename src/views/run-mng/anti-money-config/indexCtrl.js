import TableCreate from 'components/TableCreate/index'
import { riskLevelUrl } from 'api/run-module/anti-money-config.js'

const IndexCtrl = {
    data() {
        return {
            componentName:'',
            dialogStatus:false,
            tableOptions: {
                requestParams: {
                    url: riskLevelUrl,
                    data: {}
                },
                showSerialNumber: true,
                columns:[
                    {
                        attrs: {
                          label: '反洗钱风险等级',
                          prop: 'riskLevel',
                          'min-width': '130',
                        }
                    },
                    {
                        attrs: {
                          label: '等级序号',
                          prop: 'number',
                          'width': '130',
                        }
                    },
                    {
                        attrs: {
                          label: '反洗钱等级选项',
                          prop: 'content',
                          'min-width': '130',
                        }
                    },
                    {
                        attrs: {
                          label: '创建时间',
                          prop: 'saveTime',
                          'min-width': '150',
                        }
                    },
                ]
            },
        }
    },
    components: {
        TableCreate,
        DialogAdd: () => import('./components/add/index.vue'),
        DialogConfig: () => import('./components/config/index.vue'),
    },
    methods: {
        handleRowClick() {

        },
        handleCurrentChange() {

        },
        handleSelectionChange() {

        },
        handleAddClick() {
            this.componentName = 'DialogAdd'
            this.dialogStatus = true
        },
        handleDialogConfirm(){
            this.$refs.tableDom.refreshTable(true)
        },
        handleConfig(){
            this.componentName = 'DialogConfig'
            this.dialogStatus = true
        }
    },
    created() {
    },
}

export default IndexCtrl;