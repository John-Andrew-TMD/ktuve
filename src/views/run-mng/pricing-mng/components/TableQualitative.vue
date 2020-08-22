<!--定性指标-->
<template>
  <div id="run-tableQualitative" class="table-wrap">
    <el-form
      ref="formDom"
      class="stockholder-info-table-comp"
      :show-message="false"
      :model="formItems"
      style="margin-top: 10px"
      @submit.native.prevent
    >
      <el-table
        style="margin-bottom: -1px;"
        border
        class="el-table-qualitative el-table-stockholder"
        :header-cell-style="discountHeaderStyle1"
      >
        <el-table-column label="参数名">
          <el-table-column></el-table-column>
          <el-table-column class="sectable"></el-table-column>
        </el-table-column>
        <el-table-column label="参数备注"></el-table-column>
        <el-table-column label="参数值"></el-table-column>
      </el-table>
      <div class="table-tree el-table table-reset el-table--fit el-table--border">
        <template v-for="(item,index,key) in formItems.tableData">
          <template v-if="item.secondList.length">
            <el-row :key="key">
              <el-col class="cell" :span="6">
                <div
                  v-if="!canEdit||item.editFlag=='0'"
                  class="the-span the-span1"
                >{{item.parameterName}}</div>
                <div v-else class="the-span the-span1">
                  <el-input v-model="item.parameterName"></el-input>
                </div>
              </el-col>
              <el-col :span="18">
                <template v-for="(item2,index2,key2) in item.secondList">
                  <template v-if="item2.remarkList.length">
                    <el-row :key="key2">
                      <el-col class="cell" :span="8">
                        <div
                          v-if="!canEdit||item2.editFlag=='0'"
                          class="the-span"
                        >{{item2.parameterName}}</div>
                        <div v-else class="the-span">
                          <el-form-item
                            :prop="`tableData.${index}.secondList.${index2}.parameterName`"
                            required
                          >
                            <el-input v-model="item2.parameterName"></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col style="margin-bottom: 0px;" :span="16">
                        <el-row v-for="(item3,index3,key3) in item2.remarkList" :key="key3">
                          <el-col class="cell" :span="12">
                            <div
                              v-if="!canEdit||item3.editFlag=='0'||item3.editParameterRemark=='0'"
                              class="the-span"
                            >{{item3.parameterRemark}}</div>
                            <div v-else class="the-span">
                              <el-form-item
                                :prop="`tableData.${index}.secondList.${index2}.remarkList.${index3}.parameterRemark`"
                              >
                                <el-input v-model="item3.parameterRemark"></el-input>
                              </el-form-item>

                              <!-- <el-input v-model="item3.parameterRemark"></el-input> -->
                            </div>
                          </el-col>
                          <el-col class="cell hasDeleteCell" :span="12">
                            <div
                              v-if="!canEdit||item3.editFlag=='0'||item3.editParameterValue=='0'||item3.id=='1272816241366568962'||item3.id=='1272816241542729730'"
                              class="the-span"
                            >{{item3.parameterValue}}</div>
                            <div v-else class="the-span">
                              <el-form-item
                                :prop="`tableData.${index}.secondList.${index2}.remarkList.${index3}.parameterValue`"
                                required
                              >
                                <el-input v-model="item3.parameterValue"></el-input>
                              </el-form-item>
                              <el-button
                                v-if="canEdit&&item3.editFlag!='0'&&item3.editParameterRemark!='0'"
                                class="danger-btn"
                                type="text"
                                :disabled="delBtnDisabled"
                                icon="el-icon-remove-outline"
                                @click="handleDeleteClick(item.secondList,index2,item2.remarkList,index3)"
                              />
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </template>
                <!-- <el-row v-for="(item2,index2,key2) in item.secondList.filter(el=>el.remarkList.length)" :key="key2">
             
                </el-row>-->
              </el-col>
            </el-row>
          </template>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
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
      formItems: {
        tableData: []
      },
      isEnabled: false,
      qualitativeTable: [],
      qualitativeThs: [],
      metaId: null // 顶部占比和状态数据项Id
    };
  },
  watch: {
    tableData: {
      handler(newName, oldName) {
        this.getTableData(newName);
      },
      immediate: true,
      deep: false
    }
  },
  created() {
    this.getTableData(this.tableData);
  },
  mounted() {},
  methods: {
    handleDeleteClick(secondList, index2, remarkList, index3) {
      if (remarkList.length) {
        remarkList.splice(index3, 1);
        if(!remarkList.length){
          secondList.splice(index2, 1);
        }
      }
    },
    getTableData(newName) {
      let secondList = [];
      newName.map(item => {
        secondList = secondList.concat(item.secondList);
      });
      let remarkList = [];
      secondList.map(item => {
        remarkList = remarkList.concat(item.remarkList);
      });
      this.formItems.tableData = this.tableData;
    },
    discountHeaderStyle1({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 1) {
        return { display: "none" };
      }
    }
  }
};
</script>

<style lang='scss'>
#run-tableQualitative {
  .table-tree {
    .el-row {
      border-bottom: 1px solid #e3e8ee;
    }
  }
  .el-table table {
    border-spacing: 0;
    border-collapse: collapse;
  }
  .el-table-stockholder {
    .el-table__empty-block {
      display: none;
    }
  }
  .el-table__body-wrapper .el-table__row > td {
    padding: 0px 0;
  }
  .the-span {
    display: inline-block;
  }
  .el-row {
    margin-bottom: -1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .the-span1 {
    padding-top: 5%;
  }
  .the-span {
    padding: 5px 0;
  }
  .el-table .cell {
    min-height: 34px;
  }
  .table-reset {
    .the-span {
      width: 100%;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-direction: row;
      flex-direction: row;
      -webkit-box-pack: start;
      -ms-flex-pack: start;
      justify-content: flex-start;
      -ms-flex-align: center;
      align-items: center;
      .danger-btn {
        font-size: 16px;
        margin-left: auto;
      }
    }
  }
  .el-table-qualitative {
    .cell {
      .the-span {
        padding: 5px 0;
      }
      padding-right: 0px;
      padding-left: 0px;
    }
  }
}
</style>
