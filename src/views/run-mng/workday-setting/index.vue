<template>
  <div class="app-content workday-setting-page">
    <quote text="工作日设置" icon="backlog"></quote>
    <div class="app-content-wrapper">
      <p class="tips">默认星期六、星期天为非工作日，其他时间为工作日。如果其他日期也为非工作日，需要手动设置。</p>
      <div class="form-container">
        <p class="example">
          图例：
          <span class="work-day">非工作日</span>
          <span>工作日</span>
        </p>
        <div class="form">
          <label>年份：</label>
          <el-select
            v-model="selectedYear"
            placeholder="请选择"
            size="mini"
            @change="_getWorkdayData"
            style="width: 100px;margin-right: 5px;"
          >
            <el-option
              v-for="item in yearsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="handlerInitButtonClick">初始化工作日</el-button>
        </div>
      </div>
      <div class="calendar-list" v-if="showCalendarList">
        <el-calendar
          v-for="(item, index) in 12"
          :key="index"
          v-model="selectedDay"
          :selectedDays="calendarModel['month'+(index+1)]"
          :selectedMonth="`${selectedYear}-${index+1}-01`"
        ></el-calendar>
      </div>
    </div>
  </div>
</template>
<script>
import Quote from "components/Quote";
import ElCalendar from "components/Calendar/index.js";
import { dateFormatBySeparator } from "utils";
export default {
  data() {
    return {
      selectedYear: "2019",
      yearsOptions: [],
      showCalendarList: false,
      calendarModel: {},
      selectedDay: ""
    };
  },
  watch: {
    selectedDay(newVal, oldVal) {
      this._setWorkday(newVal);
    }
  },
  created() {
    this._initUI();
    this._getWorkdayData();
  },
  methods: {
    _initUI() {
      let currentYear = new Date().getFullYear();
      this.yearsOptions = [0, 1, 2].map(n => {
        return {
          label: `${currentYear + n}年`,
          value: currentYear + n
        };
      });
      this.selectedYear = currentYear
    },
    handlerInitButtonClick() {
      this.$confirm('确认初始化工作日？确认初始化工作日后会清除原有设置的所有非工作日数据！', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$promiseRequest({
          //   code: '100342',
          //   data: {
          //     endyear: '2019',
          //     all: '1',
          //     markets: '1'
          //   }
          // }).then(res => {
          //   this.$showToast(res.data.result.prompt, 'success')
          //   this._getWorkdayData()
          // }).catch(() => {})
        })
        .catch(() => {
        });
    },
    _getWorkdayData() {
      this.showCalendarList = true
      // this.$promiseRequest({
      //   code: "100341",
      //   data: {
      //     begindate: this.selectedYear + '0101',
      //     enddate: this.selectedYear + 1 + '0101',
      //     markets: "1"
      //   }
      // }, { showLoading: true })
      //   .then(res => {
      //     if (res.data.record.length) {
      //       let ret = res.data.record.filter(item => item.markets === "");
      //       let idx = "";
      //       let tempObj = {}
      //       for (let i = 1; i < 13; i++) {
      //         tempObj["month" + i] = [];
      //       }
      //       ret.forEach(item => {
      //         idx = +item.phydate.slice(4, 6);
      //         tempObj["month" + idx].push(
      //           dateFormatBySeparator(item.phydate)
      //         );
      //       });
      //       this.calendarModel = tempObj
      //       this.showCalendarList = false;
      //       this.$nextTick(() => {
      //         this.showCalendarList = true;
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    _setWorkday(data) {
      // this.$promiseRequest(
      //   {
      //     code: "100340",
      //     data: {
      //       action: data.type === "plus" ? "D" : "A",
      //       markets: "1",
      //       phydate: data.value.replace(/-/g, "")
      //     }
      //   },
      //   { showLoading: true }
      // ).then(res => {
      //   this.$showToast(res.data.result.prompt, 'success')
      // }).catch(() => {});
    }
  },
  components: {
    ElCalendar,
    Quote
  }
};
</script>

<style lang='scss'>
.workday-setting-page {
  $workdayColor: rgba(64, 158, 255, .8);
  .tips {
    line-height: 26px;
    color: #999999;
  }
  .form-container {
    display: flex;
    margin-top: 15px;
    padding-bottom: 10px;
    line-height: 30px;
    border-bottom: 1px solid #EEEEEE;
    .example {
      span {
        margin-right: 10px;
        padding: 4px 5px;
        border: 1px solid #CCCCCC;
      }
      .work-day {
        color: #FFFFFF;
        border: 1px solid $workdayColor;
        background: $workdayColor;
      }
    }
    .form {
      margin-left: 150px;
      label {
        font-weight: normal;
      }
    }
  }
  .calendar-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
  }
  .el-calendar {
    overflow: hidden;
    width: 270px;
    margin: 0 0 15px 15px;
    border-radius: 3px;
    box-shadow: 2px 2px 6px #DEDFE0;
    .el-calendar__header {
      padding: 10px 5px;
      text-align: center;
      background: #409EFF;
      .el-calendar__title {
        width: 100%;
        color: #FFFFFF;
      }
    }
    .el-calendar__body {
      padding: 0;
      border: 1px solid #C0D3F5;
      border-top: none;
    }
    .el-calendar-table {
      thead th {
        padding: 10px 0;
        font-weight: bold;
        color: #4C8BE0;
        background: #F7FAFF;
      }
      td {
        border: none;
      }
      .el-calendar-table__row {
        td:nth-child(6).current, td:last-child.current {
          pointer-events: none;
          color: #FFFFFF;
          background: $workdayColor;
        }
        .next, .prev {
          pointer-events: none;
        }
      }
      .el-calendar-day {
        transition-duration: .3s;
      }
      td.is-selected, .el-calendar-day:hover {
        color: #FFFFFF;
        background: $workdayColor;
      }
    }
    .el-calendar-day {
      height: 36px;
      text-align: center;
    }
  }
}

</style>
