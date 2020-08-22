<template>
  <div class="el-calendar">
    <div class="el-calendar__header">
      <div class="el-calendar__title">{{ i18nDate }}</div>
    </div>
    <div class="el-calendar__body" key="no-range">
      <date-table
        :date="date"
        :selected-day="realSelectedDay"
        :first-day-of-week="realFirstDayOfWeek"
        @pick="pickDay"
      />
    </div>
  </div>
</template>

<script>
import Locale from 'element-ui/src/mixins/locale';
import fecha from 'element-ui/src/utils/date';
import DateTable from './date-table';

const validTypes = ['prev-month', 'today', 'next-month'];
const oneDay = 86400000;

export default {
  name: 'ElCalendar',

  mixins: [Locale],

  components: {
    DateTable
  },

  props: {
    value: [Date, String, Number],
    selectedMonth: {
      type: String,
      default: ''
    },
    selectedDays: {
      type: Array,
      default() {
        return []
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 1
    }
  },

  provide() {
    return {
      elCalendar: this
    };
  },

  methods: {
    pickDay(day) {
      let idx = this.realSelectedDay.indexOf(day)
      let type
      if(idx === -1) {
        type= 'plus'
        this.realSelectedDay.push(day);
      } else {
        type= 'minus'
        this.realSelectedDay.splice(idx, 1);
      }
      this.$emit('input', {
        value: day,
        type
      });
    }
  },

  computed: {

    i18nDate() {
      const year = this.date.getFullYear();
      const month = this.date.getMonth() + 1;
      return `${year} ${this.t('el.datepicker.year')} ${this.t('el.datepicker.month' + month)}`;
    },

    date() {
      return new Date(this.selectedMonth)
    },

    realFirstDayOfWeek() {
      if (this.firstDayOfWeek < 1 || this.firstDayOfWeek > 6) {
        return 0;
      }
      return Math.floor(this.firstDayOfWeek);
    },
  },

  created() {
    this.realSelectedDay = [].concat(this.selectedDays)
  },

  data() {
    return {
      realSelectedDay: []
    };
  }
};
</script>
