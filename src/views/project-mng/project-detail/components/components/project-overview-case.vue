<!-- 项目概览-融资租赁方案 -->
<template>
  <form-create v-model="formApi" :rule="formRules" :option="formOptions"></form-create>
</template>

<script>
import { queryDictItems, thousandSeparator, decimalsFormat } from 'utils'

export default {
  data() {
    return {
      formApi: {},
      formRules: [
        {
          type: 'number-input',
          field: 'lease_financing',
          title: '意向金额',
          props: {
            disabled: true,
            needFormat: true
          },
          col: {
            span: 11
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'input',
          field: 'lease_term',
          title: '租赁期限',
          props: {
            disabled: true
          },
          col: {
            span: 11
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['月']
            }
          ]
        },
        {
          type: 'input',
          field: 'bond_rate',
          title: '保证金比率',
          props: {
            disabled: true
          },
          col: {
            span: 11
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ]
        },
        {
          type: 'input',
          field: 'annual_interest_rate',
          title: '租息率',
          props: {
            disabled: true
          },
          col: {
            span: 11
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ]
        },
        {
          type: 'input',
          field: 'service_fee_rate',
          title: '手续费率',
          props: {
            disabled: true
          },
          col: {
            span: 11
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ]
        },
        {
          type: 'input',
          field: 'consult_fee_rate',
          title: '咨询服务费率',
          props: {
            disabled: true
          },
          col: {
            span: 11
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ]
        },
        {
          type: 'select',
          field: 'calculate_rent_method',
          title: '还款方式',
          options: queryDictItems('31903'),
          props: {
            disabled: true
          },
          col: {
            span: 11
          },
          style: { width: '100%' }
        },
        {
          type: 'input',
          field: 'irr',
          title: 'IRR',
          props: {
            disabled: true
          },
          col: {
            span: 11
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ]
        }
      ],
      formOptions: {
        form: {
          labelWidth: '140px',
          disabled: true
        },
        submitBtn: {
          show: false
        }
      }
    }
  },
  props: ['routeParams'],
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.$promiseRequest({
        code: '201707',
        data: {
          project_id: this.routeParams.project_id
        }
      }).then(res => {
        if (res.flag == 1 && res.data.record && res.data.record.length) {
          let data = res.data.record[0]
          // data.lease_financing = thousandSeparator(data.lease_financing)
          data.irr = decimalsFormat(data.irr * 100, 4, 4)
          // console.log(data)
          this.formApi.setValue(data)
        }
      })
    }
  }
}
</script>
