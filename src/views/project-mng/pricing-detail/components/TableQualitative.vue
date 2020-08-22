<!--定性指标-->
<template>
  <div id="TableQualitative" class="table-wrap">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">测算利率（irr）:{{getSumIrr()}}%</span>
      </div>
    </div>
    <div class="content-body">
      <el-form
        ref="formDom"
        class="stockholder-info-table-comp"
        :show-message="false"
        :model="formApi"
        style="margin-top: 10px"
        @submit.native.prevent
      >
        <el-table :data="formItems.tableData" border class="el-table-stockholder">
          <el-table-column width="50">
            <template slot-scope="scope">
              <span :class="{blod: scope.row.level === 1 }">{{ scope.row.serialNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="参数名" prop="parameterName">
            <template slot-scope="scope">
              <span :class="{blod: scope.row.level === 1 }">{{ scope.row.parameterName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="参数备注" prop="parameterRemark">
            <template slot-scope="scope" v-if="scope.row.level !== 1">
              <template
                v-if="scope.row.remarkList.length==1"
              >{{scope.row.remarkList[0].parameterRemark}}</template>
              <template v-else>
                <el-select
                  :disabled="!canEdit"
                  @change="handleParameterValueChange($event,scope.row.remarkList,scope.row.serialNumber)"
                  v-model.trim="getFormApiTarget(scope.row.serialNumber).paramName"
                >
                  <el-option
                    v-for="item in scope.row.remarkList"
                    :key="item.parameterRemark"
                    :label="item.parameterRemark"
                    :value="item.parameterRemark"
                  ></el-option>
                </el-select>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="参数值" prop="parameterValue">
            <template slot-scope="scope" >
              <!-- <template v-if = "" >{{priceInfo.capitalCost}}</template> -->
              <template
                v-if="scope.row.level !== 1"
              >
              <template v-if = "scope.row.parameterName=='本项目资金成本'" >{{priceInfo&&priceInfo.capitalCost}}</template>
              <template v-else-if = "scope.row.parameterName=='本项目租赁期限'" >
                <template v-if = "priceInfo">
                   {{priceInfo.leaseTerm}}{{priceInfo.leaseTerm?'月':''}}
                </template>
              </template>
              <template v-else>
                {{getFormApiTarget(scope.row.serialNumber)&&getFormApiTarget(scope.row.serialNumber).paramValue}}
              </template>
              <!-- {{(getFormApiTarget(scope.row.serialNumber)&&getFormApiTarget(scope.row.serialNumber).paramValue)?getFormApiTarget(scope.row.serialNumber)&&scope.row.serialNumber=="1.2"?'月':'':''}} -->
              </template>
            </template>
          </el-table-column>
          <el-table-column label="得分">
            <template
              slot-scope="scope"
              v-if="scope.row.level === 1"
            >{{getSummaryRemarkList(formApi[scope.row.serialNumber-1])}}</template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import { generateTree,getTargetData } from "utils";
import { PriceBusinessQueryPriceDetailed } from "api/project-module/api-project-pricing";
export default {
  components: {},
  props: {
    priceInfo:{
       type: Object,
       default: null
    },
    tableData: {
      type: Object,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    modelFlag: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ratio: "",
      formApi: [],
      formItems: {
        tableData: []
      },
      isEnabled: false,
      metaId: null // 顶部占比和状态数据项Id
    };
  },
  // computed:{
  //   measureIrr(){
  //     return getSumIrr()
  //   }
  // },
  watch: {
    canEdit: {
      handler(newCanEdit, oldCanEdit) {
        this.canEdit = newCanEdit;
      },
      immediate: true,
      deep: false
    },
    tableData: {
      handler(newName, oldName) {
        if (newName.length) {
          this.getTableData(newName);
        }
      },
      immediate: true,
      deep: false
    }
  },
  methods: {
    getSumIrr() {
      let sumIrr = this.formApi.map(item => item.paramValue);
      if (!sumIrr) return;
      if (sumIrr[0] == "") return;
      if (!sumIrr.length) return;
      let sum =
        sumIrr &&
        sumIrr.reduce((prev, curr) => {
          return prev + curr;
        }) ;
        this.$store.commit("price/SET_PRICE_DATA",{measureIrr:sum.toFixed(4)})
      return sum.toFixed(4);
    },
    getFormApiTarget(serialNumber) {
      if (serialNumber) {
        if (this.formApi[(serialNumber + "").split(".")[0] - 1]) {
          let serialNumberOne = (serialNumber + "").split(".")[0] - 1;
          let serialNumberSecond = (serialNumber + "").split(".")[1] - 1;
          let thirdPriceBusinessDtos = _.get(
            this,
            `formApi[${serialNumberOne}].secondPriceBusinessDtos[${serialNumberSecond}].thirdPriceBusinessDtos[0]`
          );
          return thirdPriceBusinessDtos;
        }
      } else {
        return {
          paramName: "",
          paramValue: ""
        };
      }
    },
    handlePriceById(newName) {
      this.routeParams = Object.assign({}, this.$route.query);
      return PriceBusinessQueryPriceDetailed(
        {
          id: this.routeParams.id
        },
        { showLoading: true }
      )
        .then(res => {
          if (res.data.length) {
            res.data.map(item => {
              delete item.id;
              item.secondPriceBusinessDtos.map(itemSecond => {
                delete itemSecond.id;
                itemSecond.thirdPriceBusinessDtos.map(itemThird => {
                  delete itemThird.id;
                });
              });
            });
            this.formApi = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTableData(newName) {
      let secondList = [];
      let tableData = [];
      this.getformApi(newName);
      this.handlePriceById(newName);
      newName.map(item => {
        item.level = 1;
        item.parentId = "0";

        tableData.push(item);
        item.secondList.map(item => {
          item.parentId = item.firstParameterId;
          item.level = 2;
        });
        tableData = tableData.concat(item.secondList);
      });
      const trees = generateTree(tableData, "0", "id", "parentId");
      this.displayTableData(trees);
    },
    getformApi(newName) {
      let formApi = [];
      newName.map((item, index) => {
        formApi.push({
          paramGrade: "1",
          paramId: item.id,
          paramName: item.parameterName,
          parentParamId: "0",
          priceId: this.$route.query.id,
          secondPriceBusinessDtos: [],
          paramValue: ""
        });
        item.secondList.map((itemSecond, indexSecond) => {
          formApi[index].secondPriceBusinessDtos.push({
            paramGrade: "2",
            paramId: itemSecond.id,
            paramName: itemSecond.parameterRemark,
            parentParamId: itemSecond.firstParameterId,
            paramValue: itemSecond.parameterValue,
            priceId: this.$route.query.id,
            thirdPriceBusinessDtos: [
              {
                paramGrade: "3",
                paramId: itemSecond.remarkList[0].parameterRemark.id,
                paramName: itemSecond.remarkList[0].parameterRemark,
                paramValue: itemSecond.remarkList[0].parameterValue,
                parentParamId: itemSecond.remarkList[0].secondParameterId,
                priceId: this.$route.query.id
              }
            ]
          });
        });
      });
      this.formApi = formApi;
    },
    add() {
      var args = arguments, //获取所有的参数
        lens = args.length, //获取参数的长度
        d = 0, //定义小数位的初始长度，默认为整数，即小数位为0
        sum = 0; //定义sum来接收所有数据的和
      //循环所有的参数
      for (var key in args) {
        //遍历所有的参数
        //把数字转为字符串
        var str = "" + args[key];
        if (str.indexOf(".") != -1) {
          //判断数字是否为小数
          //获取小数位的长度
          var temp = str.split(".")[1].length;
          //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
          d = d < temp ? temp : d;
        }
      }
      //计算需要乘的数值
      var m = Math.pow(10, d);
      //遍历所有参数并相加
      for (var key in args) {
        sum += args[key] * m;
      }
      //返回结果
      return sum / m;
    },
    getSummaryRemarkList(data) {
      if (!data) return;
      let secondPriceBusinessDtos =
        data &&
        data.secondPriceBusinessDtos.map(item => {
          if (
            item.thirdPriceBusinessDtos.length &&
            item.thirdPriceBusinessDtos[0].paramValue
          ) {
            return item.thirdPriceBusinessDtos[0].paramValue;
          } else {
            return 0;
          }
        });
      let sum =
        secondPriceBusinessDtos &&
        secondPriceBusinessDtos.reduce((prev, curr) => {
          return this.add(prev, curr);
        });
      data.paramValue = sum;
      return sum;
    },
    handleParameterValueChange(event, remarkList, serialNumber) {
      this.getFormApiTarget(serialNumber).paramValue = event
        ? remarkList.find(ele => ele.parameterRemark === event).parameterValue
        : "";
    },
    displayTableData(data) {
      const tempArr = [];
      function flatArray(nodes, parentIndex) {
        nodes = nodes.sort((a, b) => a.itemOrder - b.itemOrder);
        if (nodes[0].level > 2) return;
        nodes.forEach((item, index) => {
          item.serialNumber =
            (item.level > 1 ? `${parentIndex}.` : "") + (index + 1);
          tempArr.push(item);
          if (Array.isArray(item.children) && item.children.length) {
            flatArray(item.children, index + 1);
            if (item.level > 1) return;
            delete item.children;
          }
        });
      }
      flatArray(data);
      this.formItems.tableData = tempArr;
    }
  }
};
</script>

<style lang='scss' >
</style>
