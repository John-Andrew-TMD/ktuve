<script>
import {
  timestampFormat,
  queryChinaRegionByIds,
  deepAssign,
  thousandSeparator
} from "utils";
export default {
  props: {
    otherFormItem: Object,
    contractRowInfo: Object
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    switchTimeFormat(time) {
      const dateTime = new Date(time);
      const year = dateTime.getFullYear();
      const month = dateTime.getMonth() + 1;
      const date = dateTime.getDate();
      const hour = dateTime.getHours();
      const minute = dateTime.getMinutes();
      const second = dateTime.getSeconds();
      return `${year}-${this.addZero(month)}-${this.addZero(
        date
      )} ${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(second)}`;
    },
    addZero(v) {
      return v < 10 ? "0" + v : v;
    },
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    }
  },
  computed: {},
  render() {
    let getTemplateContent = item => {
      let template = item.map((item2, index2) => {
        let numberValue = ""
        if(this.contractRowInfo.conQuotationDto&&this.contractRowInfo.conQuotationDto[item2.field]){
          numberValue = this.contractRowInfo.conQuotationDto[item2.field]
        }else{
          numberValue = this.contractRowInfo[item2.field]
          ? this.contractRowInfo[item2.field]
          : JSON.parse(this.contractRowInfo.content)[item2.field];
        }
        if (typeof item2 === "object") {
          if (item2.type == "number-input") {
            if (item2.props) {
              return thousandSeparator(Number(numberValue), item2.props.minDecimal) || numberValue;
            } else {
              return thousandSeparator(Number(numberValue)) || numberValue;
            }
          } else if (item2.type == "date-picker") {
            return timestampFormat(numberValue, "YYYY-MM-DD");
          } else if (item2.type == "select") {
            let template2 = item2.options.map((item3, index3) => {
              if (numberValue == item3.value) {
                return item3.label;
              }
            });
            return template2;
          }
          return numberValue;
        }
        return item2;
      });
      return template;
    };
    let getTemplateInputChild = (otherFormItem, action) => {
      return otherFormItem.children.map((item, index) => {
        if (item.slot == action) {
          return <span>{item.children}</span>;
        }
      });
    };
    if (
      this.otherFormItem &&
      this.otherFormItem.props &&
      Array.isArray(this.otherFormItem.props.options)
    ) {
      if (this.otherFormItem.type == "custom-radio-group") {
        return (
          <ul>
            {this.otherFormItem.props.options.map((item, index) => {
              if (Array.isArray(item.options)) {
                let label = "";
               
                label = item.options.map((item2, index2) => {
                  let label2 = "";
                  if (Array.isArray(item2.label)) {
                    label2 = getTemplateContent(item2.label);
                  } else {
                    label2 = item2.label;
                  }
                  if (this.otherFormItem.value.radio) {
                    if (
                      ("" + this.otherFormItem.value.radio).includes(
                        "" + item2.value
                      )
                    ) {
                      return label2;
                    }
                  } else {
                    return <div>{label2}</div>;
                  }
                });
                 if(item.parentValue){
                   if(this.otherFormItem.value.radio==item.parentValue){
                     return <li>{label}</li>;
                   }
                 }else{
                  return <li>{label}</li>;
                 } 
              } else {
                return <li>{getTemplateContent(item)}</li>;
              }
            })}
          </ul>
        );
      } else {
        return (
          <ul>
            {this.otherFormItem.props.options.map((item, index) => {
              let label = "";
              if (Array.isArray(item)) {
                return <li>{getTemplateContent(item)}</li>;
              } else if (typeof item == "object") {
                if (Array.isArray(item.label)) {
                  label = getTemplateContent(item.label);
                } else {
                  label = item.label;
                }
                if (("" + this.otherFormItem.value).includes(item.value)) {
                  return <li>{label}</li>;
                }
              } else {
                return <li>{item}</li>;
              }
            })}
          </ul>
        );
      }
    } else if (this.otherFormItem.children) {
      let itemValue = this.otherFormItem.value ? this.otherFormItem.value : 0;
      if (this.otherFormItem.field == "purchasePrice") {
        return (
          <ul>
            <li>
              {getTemplateInputChild(this.otherFormItem, "prepend")}
              {this.otherFormItem.type == "number-input"
                ? thousandSeparator(itemValue, 0)
                : itemValue}
              {getTemplateInputChild(this.otherFormItem, "append")}
            </li>
            <li>
              若乙方在履约过程中未发生违约情况RMB
              {this.otherFormItem.type == "number-input"
                ? thousandSeparator(
                    this.contractRowInfo.purchasePriceDefault,
                    0
                  )
                : this.contractRowInfo.purchasePriceDefault}
              {getTemplateInputChild(this.otherFormItem, "append")}
            </li>
          </ul>
        );
      } else {
        return (
          <span>
            {getTemplateInputChild(this.otherFormItem, "prepend")}
            {this.otherFormItem.type + "" == "number-input"
              ? thousandSeparator(itemValue, 0)
              : itemValue}
            {getTemplateInputChild(this.otherFormItem, "append")}
          </span>
        );
      }
    } else if (this.otherFormItem.type == "custom-guarantee-list") {
      return (
        <div class="guarantee-table">
          <el-table
            border
            empty-text="新增担保、抵押、质押后详情页反显"
            data={this.contractRowInfo.conGuaranteeInfoTableEntityDtos}
            style="width: 100%"
          >
            <el-table-column
              prop="contractName"
              label="合同名称"
            ></el-table-column>
            <el-table-column
              prop="contractNo"
              label="合同编号"
            ></el-table-column>
            <el-table-column prop="guarantee" label="担保方"></el-table-column>
            <el-table-column
              prop="collateral"
              label="抵/质押物"
            ></el-table-column>
          </el-table>
        </div>
      );
    }
  }
};
</script>


<style lang="scss" scoped>
.guarantee-table {
  overflow: auto;
  max-height: 300px;
  .el-table {
  }
}
ul {
  & > li:nth-child(1) {
    margin-top: 0px !important;
  }
  & > li {
    & > div:nth-child(1) {
      margin-top: 0px !important;
    }
    & > div {
      margin-top: 10px;
    }
    margin-top: 10px;
  }
}
</style>
