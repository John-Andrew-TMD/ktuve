<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      title="新增参数"
      width="800px"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <div class="action-rating-results">
        <el-button type="primary" @click="handleAddClick">添加</el-button>
        <el-form
          ref="formDom"
          class="stockholder-info-table-comp"
          :show-message="false"
          :model="formItems"
          style="margin-top: 10px"
          @submit.native.prevent
        >
          <el-table
            highlight-current-row
            @current-change="handleCurrentChange"
            :data="formItems.tableData"
            :header-cell-style="discountHeaderStyle1"
            border
            style="width: 100%"
          >
            <el-table-column label="参数名称">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="12">
                    <el-select
                      v-model.trim="scope.row.firstParameterId"
                      @change="AddSelectDept(scope.row,scope.$index)"
                    >
                      <el-option
                        v-for="(item,key) in tableData.filter((item,index)=>item.parameterName!='其他调节系数')"
                        :key="key"
                        :label="item.parameterName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model.trim="scope.row.parameterDetail" size="mini" />
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="参数备注">
              <template slot-scope="scope">
                <div
                  v-for="(item,index) in scope.row.remarkList"
                  :key="index"
                  :class="(scope.row.remarkList.length>1)?'mb-10':''"
                >
                  <el-input v-model.trim="item.parameterRemark" size="mini" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="参数值">
              <template slot-scope="scope">
                <div
                  v-for="(item,index) in scope.row.remarkList"
                  :key="index"
                  :class="(scope.row.remarkList.length>1)?'mb-10':''"
                >
                  <number-input :allow-minus = "true" :min-value="-9999999999999999" v-model="item.parameterValue" size="mini" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <el-table-column width="80" class-name="operation">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    :disabled="delBtnDisabled"
                    icon="el-icon-remove-outline"
                    @click="handleDeleteMutiClick(scope.row,scope.$index)"
                  />
                  <el-button
                    type="text"
                    :disabled="addBtnDisabled"
                    icon="el-icon-circle-plus-outline"
                    @click="handleAddMutiClick(scope.row,scope.$index)"
                  />
                </template>
              </el-table-column>
              <el-table-column width="80">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="handleDeleteClick(scope.row,scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-form>

        <!-- <div class="tips">说明：参考备注有多个的情况下，用“｜”隔开。</div> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ISomPricingModelBusinessAddModelParameter } from "api/project-module/api-project-pricing";
export default {
  inheritAttrs: false,
  data() {
    return {
      rowData: [],
      formItems: {
        tableData: [
          {
            firstParameterId: null,
            parameterName: "",
            parameterDetail: "",
            parameterRemarkType: "",
            remarkList: [
              {
                parameterValue: "",
                parameterRemark: ""
              }
            ]
          }
        ]
      },
      showLoading: true,
      dialogVisible: false
    };
  },
  props: {
    tableData: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.dialogVisible = true;
  },
  methods: {
    AddSelectDept(rowData, index) {
      this.formItems.tableData[index].parameterName = rowData.firstParameterId
        ? this.tableData.find(ele => ele.id === rowData.firstParameterId)
            .parameterName
        : "";
        this.transOneValue(this.formItems.tableData[index].remarkList,rowData.parameterName)
    },
    transOneValue(remarkList,parameterName) {
      if (parameterName == "租赁项目基础利率") {
        for (var i = remarkList.length - 1; i >= 0; i--) {
          if (i != 0) {
            remarkList.splice(i, 1);
          }
        }
      }
    },
    handleDeleteMutiClick(rowData, index) {
      if (rowData.remarkList.length == 1) return;
      rowData.remarkList.splice(index, 1);
    },
    handleDeleteClick(rowData, index) {
      if (this.formItems.tableData.length == 1) return;
      this.formItems.tableData.splice(index, 1);
    },
    handleAddMutiClick(rowData, index) {
      // if(rowData.parameterName=="租赁项目基础利率") return;
      rowData.remarkList.push({
        parameterValue: "",
        parameterRemark: ""
      });
    },
    handleAddClick(rowData, index) {
      this.formItems.tableData.splice(
        this.formItems.tableData.length - 1 + 1,
        0,
        {
          firstParameterId: null,
          parameterName: "",
          parameterRemarkType: "",
          remarkList: [
            {
              parameterValue: "",
              parameterRemark: ""
            }
          ]
        }
      );
    },
    discountHeaderStyle1({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 1) {
        return { display: "none" };
      }
    },
    
    handleCurrentChange(row, index) {
      if (!row) return;
      this.rowData = row;
    },
    handleDialogConfirm() {
      this.$refs.formDom.validate(async valid => {
        if (valid) {
          const params = this.formItems.tableData;
          ISomPricingModelBusinessAddModelParameter(params, {
            showLoading: true
          })
            .then(res => {
              this.$showToast("新增成功！", "success");
              this.dialogVisible = false;
              const { ids } = res.data;
              this.$emit("handleGetbyId", {
                ids
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    handleDialogClosed() {
      this.$emit("update:dialogStatus", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.action-rating-results {
  min-height: 500px;
  & /deep/ .el-table {
    .el-input-number--mini {
      width: 80px;
    }
    .operation {
      .el-button {
        margin-top: 3px;
        padding-top: 0;
        padding-bottom: 0;
        font-size: 18px !important;
      }
    }
  }
  .tips {
    margin-top: 15px;
  }
}
</style>
