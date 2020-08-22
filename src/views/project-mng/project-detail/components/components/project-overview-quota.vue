<!-- 项目概览-承租人基本信息 -->
<template>
  <div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">额度信息</span>
      </div>
    </div>
    <template v-if="this.quotaInfo">
      <div class="content-body">
        <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      </div>
    </template>
    <div v-else class="no-data">
      <div class="no-data-top" />
      <p class="no-data-text">您还没有录入相关信息</p>
    </div>
  </div>
</template>

<script>
import { queryDictItems } from "utils";
import {
  queryQuotaByCustId,
  quotaList,
  creditList
} from "api/customer-module/api-customer-quota-mng.js";
import dayjs from "dayjs";
export default {
  props: ["routeParams", "projectInfo"],
  data() {
    return {
      formApi: {},
      canEdit: false,
      formRules: [
        {
          type: "input",
          field: "lesseeName",
          title: "承租人/转让方名称",
          col: { span: 12 },
          props: { disabled: true }
        },
        {
          type: "number-input",
          field: "amtTotal",
          title: "授信额度",
          props: { disabled: "true", "max-decimal": 4 },
          children: [
            {
              type: "span",
              slot: "append",
              children: ["元"]
            }
          ],
          col: { span: 12 }
        },
        {
          type: "number-input",
          field: "amtUsed",
          title: "已用额度",
          props: { disabled: "true", "max-decimal": 4 },
          children: [
            {
              type: "span",
              slot: "append",
              children: ["元"]
            }
          ],
          col: { span: 12 }
        },
        {
          type: "number-input",
          field: "amtCan",
          title: "可用额度",
          props: { disabled: "true", "max-decimal": 4 },
          children: [
            {
              type: "span",
              slot: "append",
              children: ["元"]
            }
          ],
          col: { span: 12 }
        },
        {
          type: "select",
          field: "creditStatus",
          title: "授信状态",
          options: queryDictItems("10050"),
          props: { disabled: true },
          col: { span: 12 }
        },
        {
          type: "input",
          field: "timeDiff",
          title: "授信期限",
          col: { span: 12 },
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
          type: "el-date-picker",
          field: "createTime",
          title: "起始日期",
          props: {
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp"
          },
          col: { span: 12 }
        },
        {
          type: "el-date-picker",
          field: "overTime",
          title: "到期日期",
          props: {
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp"
          },
          col: { span: 12 }
        },
        {
          type: "select",
          field: "isRevolve",
          title: "是否集团授信",
          options: queryDictItems("10004"),
          props: { disabled: true },
          col: { span: 12 }
        }
      ],
      formOptions: {
        form: {
          labelWidth: "140px",
          disabled: true
        },
        submitBtn: {
          show: false
        }
      },

      formData: {}, // 用来存放查询到的数据
      quotaInfo: {}
    };
  },
  computed: {
    custId() {
      return +this.projectInfo.businessCategory == 2
        ? this.projectInfo.transferorId
        : this.projectInfo.lesseeId;
    }
  },
  mounted() {
    this.initForm();
  },
  methods: {
    initForm() {
      this.getQuotaList();
    },
    getQuotaList() {
      queryQuotaByCustId({ id: this.custId }, { showLoading: true }).then(
        res => {
          if (res) {
            this.quotaInfo = res.data;
            if(res.data){
              res.data.createTime = res.data.createTime ? res.data.createTime : 0;
              res.data.overTime = res.data.overTime ? res.data.overTime : 0;
              const timeDiff = dayjs(res.data.createTime).diff(
                dayjs(res.data.overTime),
                "month"
              );
            }
            this.formApi.setValue({
              ...res.data,
              lesseeName: this.projectInfo.lesseeName,
              timeDiff
            });
          }
        }
      );
    }
  }
};
</script>
<style lang="scss">
</style>
