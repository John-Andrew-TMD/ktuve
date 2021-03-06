module.exports = [
  {
    value: '1',
    label: '通用设备',
    children: [
      {
        value: '11',
        label: '锅炉及原动机'
      },
      {
        value: '12',
        label: '金属加工设备'
      },
      {
        value: '13',
        label: '起重设备'
      },
      {
        value: '14',
        label: '装卸设备'
      },
      {
        value: '15',
        label: '其它通用设备'
      }
    ]
  },
  {
    value: '2',
    label: '专用设备',
    children: [
      {
        value: '21',
        label: '工程机械'
      },
      {
        value: '22',
        label: '电力设备'
      },
      {
        value: '23',
        label: '纺织设备'
      },
      {
        value: '24',
        label: '印刷设备'
      },
      {
        value: '25',
        label: '医疗器械'
      },
      {
        value: '26',
        label: '环保设备'
      },
      {
        value: '27',
        label: '农林牧渔机械',
        children: [
          {
            value: '271',
            label: '农机具'
          },
          {
            value: '272',
            label: '其它农林牧渔机械'
          }
        ]
      },
      {
        value: '28',
        label: '矿采设备'
      },
      {
        value: '29',
        label: '冶炼设备',
        children: [
          {
            value: '291',
            label: '钢铁'
          },
          {
            value: '292',
            label: '有色金属'
          },
          {
            value: '293',
            label: '其它冶炼设备'
          }
        ]
      },
      {
        value: '210',
        label: '炼油化工设备'
      },
      {
        value: '211',
        label: '其它专用设备'
      },
    ]
  },
  {
    value: '3',
    label: '交通运输设备',
    children: [
      {
        value: '31',
        label: '飞机',
        children: [
          { value: '311',
            label: '通用航空类飞机'
          },
          { value: '312',
            label: '客运飞机',
          },
          { value: '313',
            label: '货物运输飞机'
          },
          { value: '314',
            label: '直升机'
          },
          { value: '315',
            label: '其它飞机'
          }
        ]
      },
      {
        value: '32',
        label: '船舶',
        children: [
          { value: '321',
            label: '货船'
          },
          { value: '322',
            label: '客船',
          },
          { value: '323',
            label: '工程船'
          },
          { value: '324',
            label: '其它船舶'
          }
        ]
      },
      {
        value: '33',
        label: '城市交通设备',
        children: [
          { value: '331',
            label: '轨道交通'
          },
          { value: '332',
            label: '汽车',
          },
          { value: '333',
            label: '其它城市交通设备'
          }
        ]
      },
      {
        value: '34',
        label: '铁路运输设备'
      },
      {
        value: '35',
        label: '其它交通运输设备'
      }
    ]
  },
  {
    value: '4',
    label: '电子产品及通信设备',
    children: [
      { value: '41',
        label: '通信设备'
      },
      { value: '42',
        label: '计算机',
      },
      { value: '43',
        label: '其它电信设备'
      }
    ]
  },
  {
    value: '5',
    label: '电气设备'
  },
  {
    value: '6',
    label: '土地、房屋及构筑物',
    children: [
      { value: '61',
        label: '土地'
      },
      { value: '62',
        label: '房屋',
      },
      { value: '63',
        label: '构筑物',
        children: [
          { value: '631',
            label: '道路'
          },
          { value: '632',
            label: '桥梁',
          },
          { value: '633',
            label: '其它构筑物'
          }
        ]
      }
    ]
  },
  {
    value: '7',
    label: '其它租赁物'
  }
]
