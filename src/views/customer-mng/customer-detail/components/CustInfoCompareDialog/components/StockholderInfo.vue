<template>
  <div v-loading="showLoading" class="comp-stockholder-info">
    <fieldset v-for="(item, index) in dataList" :key="index" class="stockholder-item">
      <legend>序号{{ index + 1 }}</legend>
      <h4 class="title">基本信息修改前</h4>
      <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
        <thead>
          <tr>
            <th width="50px">序号</th>
            <th>股东名称</th>
            <th>股东类型</th>
            <th>实缴额（万元）</th>
            <th>持股比例（%）</th>
            <th>认缴额（万元）</th>
            <th>责任形式</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="item.baseInfoArr.old.length">
            <tr>
              <td>{{ index + 1 }}</td>
              <td
                v-for="(it, idx) in item.baseInfoArr.old" :key="idx"
              >{{ it.value | filterHandler(it.filter) }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="8">暂无数据</td>
            </tr>
          </template>
        </tbody>
      </table>
      <h4 class="title">基本信息修改后</h4>
      <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
        <thead>
          <tr>
            <th width="50px">序号</th>
            <th>股东名称</th>
            <th>股东类型</th>
            <th>实缴额（万元）</th>
            <th>持股比例（%）</th>
            <th>认缴额（万元）</th>
            <th>责任形式</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="item.baseInfoArr.new.length">
            <tr>
              <td>{{ index + 1 }}</td>
              <td v-for="(it, idx) in item.baseInfoArr.new" :key="idx">
                <span :class="it.className">{{ it.value | filterHandler(it.filter) }}</span>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="8">暂无数据</td>
            </tr>
          </template>
        </tbody>
      </table>
      <h4 class="title">认缴明细修改前</h4>
      <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
        <thead>
          <tr>
            <th width="50px">序号</th>
            <th>认缴出资额</th>
            <th>认缴出资日期</th>
            <th>认缴出资方式</th>
            <th>认缴出资币种</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="item.subcribeArr.old.length">
            <tr v-for="(it, idx) in item.subcribeArr.old" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td v-for="(o, i) in it" :key="i">
                {{ o.value | filterHandler(o.filter) }}
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">暂无数据</td>
            </tr>
          </template>
        </tbody>
      </table>
      <h4 class="title">认缴明细修改后</h4>
      <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
        <thead>
          <tr>
            <th width="50px">序号</th>
            <th>认缴出资额</th>
            <th>认缴出资日期</th>
            <th>认缴出资方式</th>
            <th>认缴出资币种</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="item.subcribeArr.new.length">
            <tr v-for="(it, idx) in item.subcribeArr.new" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td v-for="(o, i) in it" :key="i">
                <span :class="o.className">{{ o.value | filterHandler(o.filter) }}</span>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">暂无数据</td>
            </tr>
          </template>
        </tbody>
      </table>
      <h4 class="title">实缴明细修改前</h4>
      <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
        <thead>
          <tr>
            <th width="50px">序号</th>
            <th>实缴出资额</th>
            <th>实缴出资日期</th>
            <th>实缴出资方式</th>
            <th>实缴出资币种</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="item.paidInArr.old.length">
            <tr v-for="(it, idx) in item.paidInArr.old" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td v-for="(o, i) in it" :key="i">
                {{ o.value | filterHandler(o.filter) }}
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">暂无数据</td>
            </tr>
          </template>
        </tbody>
      </table>
      <h4 class="title">实缴明细修改后</h4>
      <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
        <thead>
          <tr>
            <th width="50px">序号</th>
            <th>实缴出资额</th>
            <th>实缴出资日期</th>
            <th>实缴出资方式</th>
            <th>实缴出资币种</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="item.paidInArr.new.length">
            <tr v-for="(it, idx) in item.paidInArr.new" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td v-for="(o, i) in it" :key="i">
                <span :class="o.className">{{ o.value | filterHandler(o.filter) }}</span>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">暂无数据</td>
            </tr>
          </template>
        </tbody>
      </table>
    </fieldset>
  </div>
</template>

<script>
import { getCustomerShareholderList } from "api/customer-module/api-customer-detail.js";
import { deepAssign } from 'utils'
const FILTER_NAMES = {
  dict: "filterDictValue",
  date: "filterDateSeparate",
  timestamp: "filterTimestamp",
  toThousand: "filterToThousand"
};
export default {
  filters: {
    filterHandler(val, filterOptions) {
      if (!filterOptions) return val;
      const { name, params } = filterOptions;
      if (FILTER_NAMES[name]) {
        return Vue.filter(FILTER_NAMES[name])(val, params);
      } else if (name === "number") {
        return (+val || 0).toFixed(2);
      } else {
        return val;
      }
    }
  },
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dataList: [],
      showLoading: true
    };
  },
  created() {
    this.getStockholderInfo();
  },
  methods: {
    getStockholderInfo() {
      getCustomerShareholderList({
        custId: this.routeParams.id
      })
        .then(res => {
          if (res.data) {
            this.compareNewAndOldData(res.data.newCrm, res.data.oldCrm)
          } else {
            this.$showToast("股东信息数据异常！");
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
    compareNewAndOldData(newData, oldData) {
      debugger
      if (!newData.length && !oldData.length) return;
      const compareItems = [
        {
          key: "shareholderName"
        },
        {
          key: "shareholderType"
        },
        {
          key: "actualAmount",
          filter: {
            name: "toThousand"
          }
        },
        {
          key: "ratio",
          filter: {
            name: "number"
          }
        },
        {
          key: "sureAmount",
          filter: {
            name: "toThousand"
          }
        },
        {
          key: "wayOfInvestment"
        },
        {
          key: "remarks"
        }
      ];
      const innerCompareItems = [
        {
          key: "amount"
        },
        {
          key: "amountDate",
          filter: {
            name: "filterTimestamp"
          }
        },
        {
          key: "amountWay"
        },
        {
          key: "amountCurrency"
        }
      ];
      const tempDataArr = [];
      if (oldData.length === 0) {
        newData.forEach(data => {
          const tempObj = {
            baseInfoArr: {
              old: [],
              new: []
            },
            subcribeArr: {
              old: [],
              new: []
            },
            paidInArr: {
              old: [],
              new: []
            }
          };
          compareItems.forEach(item => {
            const { key, filter } = item;
            tempObj.baseInfoArr.new.push({
              value: data[key],
              filter,
              className: "add"
            });
          });
          if (Array.isArray(data.detailList)) {
            data.detailList.forEach(item => {
              let tempArr = []
              innerCompareItems.forEach(it => {
                const { key, filter } = it;
                tempArr.push({
                  value: item[key],
                  filter,
                  className: "add"
                })
              });
              if (item.amountType === "0") {
                tempObj.subcribeArr.new.push(tempArr);
              } else {
                tempObj.paidInArr.new.push(tempArr);
              }
            });
          }
          tempDataArr.push(tempObj);
        });
        this.dataList = Object.freeze(tempDataArr);
      } else if (newData.length === 0) {
        oldData.forEach(data => {
          const tempObj = {
            baseInfoArr: {
              old: [],
              new: []
            },
            subcribeArr: {
              old: [],
              new: []
            },
            paidInArr: {
              old: [],
              new: []
            }
          };
          compareItems.forEach(item => {
            const { key, filter } = item;
            tempObj.baseInfoArr.old.push({
              value: data[key],
              filter
            });
            tempObj.baseInfoArr.new.push({
              value: data[key],
              filter,
              className: "delete"
            });
          });
          if (Array.isArray(data.detailList)) {
            data.detailList.forEach(item => {
              let tempArr = []
              let tempArr1 = []
              innerCompareItems.forEach(it => {
                const { key, filter } = it;
                tempArr.push({
                  value: item[key],
                  filter
                });
                tempArr1.push({
                  value: item[key],
                  filter,
                  className: "delete"
                })
              });
              if (item.amountType === "0") {
                tempObj.subcribeArr.old.push(tempArr);
                tempObj.subcribeArr.new.push(tempArr1);
              } else {
                tempObj.paidInArr.old.push(tempArr);
                tempObj.paidInArr.new.push(tempArr1);
              }
            });
          }
          tempDataArr.push(tempObj);
        });
        this.dataList = Object.freeze(tempDataArr);
      } else {
        oldData.forEach(data => {
          const tempObj = {
            baseInfoArr: {
              old: [],
              new: []
            },
            subcribeArr: {
              old: [],
              new: []
            },
            paidInArr: {
              old: [],
              new: []
            }
          };
          const compareId = data.compareId;
          const newDataIndex = newData.findIndex(
            item => item.compareId === compareId
          );
          const newDataItem = newData[newDataIndex];
          let isBaseInfoSame = false
          if (newDataItem) {
            let ret = this.compareDataItem(data, newDataItem, compareItems);
            if (ret) {
              isBaseInfoSame = true
              ret = this.compareInnerDataItem(
                data,
                newDataItem,
                innerCompareItems
              );
              if(ret) {
                newData.splice(newDataIndex, 1);
                return;
              }
            }
          }
          if(!isBaseInfoSame) {
             compareItems.forEach(item => {
              const { key, filter } = item;
              tempObj.baseInfoArr.old.push({
                value: data[key],
                filter
              });
              if (!newDataItem) {
                tempObj.baseInfoArr.new.push({
                  value: data[key],
                  filter,
                  className: "delete"
                });
              } else {
                tempObj.baseInfoArr.new.push({
                  value: newDataItem[key] || data[key] || "",
                  filter,
                  className:
                    data[key] !== newDataItem[key]
                      ? newDataItem[key]
                        ? "add"
                        : "delete"
                      : ""
                });
              }
            });
          }
          debugger
          const oldDatalist = Array.isArray(data.detailList)
            ? data.detailList
            : [];
          const newDatalist = Array.isArray(newDataItem.detailList)
            ? newDataItem.detailList
            : [];
          if (oldDatalist.length && !newDatalist.length) {
            oldDatalist.forEach(item => {
              let tempArr = []
              let tempArr1 = []
              innerCompareItems.forEach(it => {
                const { key, filter } = it;
                tempArr.push({
                  value: item[key],
                  filter
                });
                tempArr1.push({
                  value: item[key],
                  filter,
                  className: "delete"
                });
              });
              if (item.amountType === "0") {
                tempObj.subcribeArr.old.push(tempArr);
                tempObj.subcribeArr.new.push(tempArr1);
              } else {
                tempObj.paidInArr.old.push(tempArr);
                tempObj.paidInArr.new.push(tempArr1);
              }
            });
          } else if (!oldDatalist.length && newDatalist.length) {
            newDatalist.forEach(item => {
              let tempArr = []
              innerCompareItems.forEach(it => {
                const { key, filter } = it;
                tempArr.push({
                  value: item[key],
                  filter,
                  className: "add"
                });
              });
              if (item.amountType === "0") {
                tempObj.subcribeArr.new.push(tempArr);
              } else {
                tempObj.paidInArr.new.push(tempArr);
              }
            });
          } else {
            oldDatalist.forEach(item => {
              const compareId = item.compareId;
              const newDataIndex = newDatalist.findIndex(
                item => item.compareId === compareId
              );
              const newDataItem = newDatalist[newDataIndex];
              if (newDataItem) {
                let ret = this.compareDataItem(
                  item,
                  newDataItem,
                  innerCompareItems
                );
                if (ret) {
                  newDatalist.splice(newDataIndex, 1);
                  return;
                }
              }
              let tempArr = []
              let tempArr1 = []
              innerCompareItems.forEach(it => {
                const { key, filter } = it;
                tempArr.push({
                  value: item[key],
                  filter
                })
                if (!newDataItem) {
                  tempArr1.push({
                    value: item[key],
                    filter,
                    className: "delete"
                  })
                } else {
                  tempArr1.push({
                    value: newDataItem[key] || item[key] || "",
                    filter,
                    className:
                      item[key] !== newDataItem[key]
                        ? newDataItem[key]
                          ? "add"
                          : "delete"
                        : ""
                  })
                }
              });
              if (item.amountType === "0") {
                tempObj.subcribeArr.old.push(tempArr)
                tempObj.subcribeArr.new.push(tempArr1)
              } else {
                tempObj.paidInArr.old.push(tempArr)
                tempObj.paidInArr.new.push(tempArr1)
              }
              if(newDataIndex !== -1) {
                newDatalist.splice(newDataIndex, 1);
              }
            });
            if (newDatalist.length) {
              newDatalist.forEach(data => {
                let tempArr = []
                innerCompareItems.forEach(item => {
                  const { key, filter } = item;
                  tempArr.push({
                    value: data[key],
                    filter,
                    className: "add"
                  })
                });
                if (data.amountType === "0") {
                  tempObj.subcribeArr.new.push(tempArr);
                } else {
                  tempObj.paidInArr.new.push(tempArr);
                }
              });
            }
          }
          tempDataArr.push(tempObj);
          if(newDataIndex !== -1) {
            newData.splice(newDataIndex, 1);
          }
        });
        if (newData.length) {
          newData.forEach(data => {
            const tempObj = {
              baseInfoArr: {
                old: [],
                new: []
              },
              subcribeArr: {
                old: [],
                new: []
              },
              paidInArr: {
                old: [],
                new: []
              }
            };
            compareItems.forEach(item => {
              const { key, filter } = item;
              tempObj.baseInfoArr.new.push({
                value: data[key],
                filter,
                className: "add"
              });
            });
            if (Array.isArray(data.detailList)) {
              data.detailList.forEach(item => {
                let tempArr = []
                innerCompareItems.forEach(it => {
                  const { key, filter } = it;
                  tempArr.push({
                    value: item[key],
                    filter,
                    className: "add"
                  });
                });
                if (item.amountType === "0") {
                  tempObj.subcribeArr.new.push(tempArr);
                } else {
                  tempObj.paidInArr.new.push(tempArr);
                }
              });
            }
            tempDataArr.push(tempObj);
          });
        }
        this.dataList = Object.freeze(tempDataArr);
      }
    },
    compareDataItem(oldData, newData, compareItems) {
      const ret = compareItems.every(
        item => oldData[item.key] === newData[item.key]
      );
      return ret;
    },
    compareInnerDataItem(oldData, newData, compareItems) {
      const oldDatalist = Array.isArray(oldData.detailList)
        ? oldData.detailList
        : [];
      const newDatalist = Array.isArray(newData.detailList)
        ? newData.detailList
        : [];
      if (!oldDatalist.length && !newDatalist.length) return true;
      if (!oldDatalist.length || !newDatalist.length) return false;
      if (oldDatalist.length !== newDatalist.length) return false;
      return oldDatalist.every(data => {
        const compareId = data.compareId;
        const newDataIndex = newDatalist.findIndex(
          item => item.compareId === compareId
        );
        if (newDataIndex === -1) return false;
        const newDataItem = newDatalist[newDataIndex];
        return this.compareDataItem(data, newDataItem, compareItems);
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.comp-stockholder-info {
  fieldset {
    margin-bottom: 10px;
    border: 1px solid #E3E8EE;
  }
  legend {
    font-weight: bold;
  }
  .el-table-simple {
    margin-top: 10px;
    tr td:first-child {
      text-align: center;
    }
  }
  .title {
    margin: 10px 0;
  }
  .add {
    color: #FF0000;
  }
  .delete {
    text-decoration: line-through;
    color: #FF0000;
  }
}

</style>
