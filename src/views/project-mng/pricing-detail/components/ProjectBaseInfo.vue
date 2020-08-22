<template>
  <div class="table-wrap">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">项目基本信息</span>
      </div>
    </div>
    <div class="content-body">
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    </div>
  </div>
</template>

<script>
import { queryDictItems, deepAssign } from "utils";
import { PriceBusinessQueryQuotationByProjectId } from "api/project-module/api-project-pricing";
import { mapGetters } from "vuex";
export default {
  inheritAttrs: false,
  components: {},
  data() {
    return {
      formApi: null,
      detailFormCreate: [
        {
          type: "select",
          title: "项目状态",
          field: "projectStatus",
          props: { disabled: true },
          col: { span: 12 },
          options: queryDictItems("10024")
        },
        {
          type: "number-input",
          field: "leaseFinancing",
          title: "项目本金",
          col: { span: 12 },
          props: { disabled: true }
        },
        {
          type: "number-input",
          field: "measureIrr",
          title: "测算收益率（IRR）",
          col: { span: 12 },
          props: { disabled: true, "max-decimal": 4 },
          children: [
            {
              type: "span",
              slot: "append",
              children: ["%"]
            }
          ]
        },
        {
          type: "input",
          field: "bp",
          title: "优惠幅度BP",
          col: { span: 12 },
          props: { disabled: true }
        }
      ],
      rateFormCreate: [
        {
          type: "select",
          title: "项目状态",
          field: "projectStatus",
          props: { disabled: true },
          options: queryDictItems("10024")
        },
        {
          type: "el-custom-select",
          title: "项目报价方案",
          field: "quotationId",
          validate: this.formValidate({ required: true }),
          props: {
            filterable: "true",
            params: {
              url: PriceBusinessQueryQuotationByProjectId,
              data: {
                id: this.$route.query.id
              },
              searchKey: "quotationName",
              labelKey: "quotationName",
              // labelKey: {
              //   format:`报价方案（项目-2000元-4.65%）`
              // },
              valueKey: "quotationId",
              repeat: false
            },
            clearable: true
          },
          on: {
            change: v => {
              let bp = v.data.measureIrr - v.data.irr;
              let obj = deepAssign(v.data);
              // obj.measureIrr = this.formApi.formData().measureIrr;
              delete obj.measureIrr
              // obj.irr = +obj.irr * 100;
              this.formApi.setValue({ ...obj, bp });
            }
          }
        },
        {
          type: "number-input",
          field: "leaseFinancing",
          title: "项目本金",
          col: { span: 12 },
          props: { disabled: true }
        },
        {
          type: "number-input",
          field: "measureIrr",
          title: "测算收益率（IRR）",
          col: { span: 12 },
          props: { disabled: true, maxDecimal: 4, minDecimal: 2 },
          children: [
            {
              type: "span",
              slot: "append",
              children: ["%"]
            }
          ]
        },
        {
          type: "number-input",
          field: "bp",
          title: "优惠幅度BP",
          props: { disabled: true, maxDecimal: 2, minDecimal: 2 }
        },
        {
          type: "input",
          field: "reason",
          title: "优惠理由",
          col: { span: 24 },
          validate: this.formValidate({ required: true }),
          props: {
            type: "textarea"
          }
        }
      ],
      formRules: [
        {
          type: "input",
          title: "项目名称",
          field: "projectName",
          col: { span: 12 },
          props: { disabled: true }
        },
        {
          type: "input",
          field: "custName",
          title: "客户名称",
          col: { span: 12 },
          props: { disabled: true }
        },
        {
          type: "input",
          field: "projectNo",
          title: "项目编号",
          col: { span: 12 },
          props: { disabled: true }
        },
        {
          type: "select",
          title: "租赁类型",
          col: { span: 12 },
          field: "businessType",
          options: queryDictItems("10026"),
          props: { disabled: true }
        },
        {
          type: "input",
          field: "leaseTerm",
          col: { span: 12 },
          title: "租赁期限",
          props: { disabled: true },
          children: [
            {
              type: "span",
              slot: "append",
              children: ["月"]
            }
          ]
        },
        {
          type: "number-input",
          field: "irr",
          title: "项目IRR",
          col: { span: 12 },
          props: { disabled: true, maxDecimal: 4 },
          children: [
            {
              type: "span",
              slot: "append",
              children: ["%"]
            }
          ]
        }
      ],
      formOptions: {
        form: { labelWidth: "200px", disabled: true },
        submitBtn: { show: false }
      }
    };
  },
  props: {
    priceInfo:{
      type:Object,
      default:{}
    },
    routeParams: {
      type: Object,
      default: {}
    },
    flowContent: {
      type: Object,
      default: {}
    }
  },
  watch:{
    priceInfo: {
      handler(newVal, oldVal) {
        this.$nextTick(()=>{
           this.formApi.setValue({
            measureIrr:newVal.measureIrr
          })
        })
        // console.log(newVal,oldVal)
      },
      immediate: true,
      deep:true
    }
  },
  // computed:{
  //   ...mapGetters(['priceInfo'])
  // },
  mounted() {
    this.getPriceInfo();
  },
  methods: {
    insert(arrfirst, arrlast, index) {
      if (index < 0) {
        index = 0;
      } else if (index > arrfirst.length) {
        index = arrfirst.length;
      }
      for (var i = arrlast.length - 1; i >= 0; i--) {
        arrfirst.splice(index, 0, arrlast[i]); //是在index位置用arrlast[i]替换掉arrfirst数组中的0个元素
      }
      return arrfirst;
    },
    getPriceInfo() {
      if (this.routeParams.action == "rate") {
        this.insert(
          this.formRules,
          [this.rateFormCreate[0], this.rateFormCreate[1]],
          4
        );
        this.insert(this.formRules, [this.rateFormCreate[2]], 7);
        this.insert(
          this.formRules,
          [
            this.rateFormCreate[3],
            this.rateFormCreate[4],
            this.rateFormCreate[5]
          ],
          9
        );
        this.formApi.updateOptions({
          form: { disabled: false }
        });
      }
      if (this.routeParams.action == "detail") {
        // this.formRules = this.formRules.concat(this.detailFormCreate);

        this.formApi.updateOptions({
          form: { disabled: false }
        });
      }
      let priceInfo = this.priceInfo;
      priceInfo.irr = +priceInfo.irr;
      priceInfo.measureIrr = +priceInfo.measureIrr;
      this.formApi.setValue({
        ...priceInfo,
        bp: priceInfo.measureIrr - priceInfo.irr
      });
      // });
    },
    setPricingTitle(oData) {
      // if (oData) {
      //   const route = Object.assign({}, this.$route, {
      //     title: oData.projectName
      //   });
      //   this.$store.dispatch("tagsView/updateVisitedView", route);
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-select,
  .el-input,
  .el-cascader {
    width: 100%;
  }
}
</style>
