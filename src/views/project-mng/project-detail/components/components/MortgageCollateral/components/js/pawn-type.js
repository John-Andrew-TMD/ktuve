module.exports = [
  {
    value: '1',
    label: '现金及其等价物'
  },
  {
    value: '2',
    label: '贵金属'
  },
  {
    value: '3',
    label: '债券',
    children: [
      {
        value: '31',
        label: '国债'
      },
      {
        value: '32',
        label: '地方政府债'
      },
      {
        value: '33',
        label: '央票'
      },
      {
        value: '34',
        label: '政府机构债券'
      },
      {
        value: '35',
        label: '政策性金融债'
      },
      {
        value: '36',
        label: '商业性金融债'
      },
      {
        value: '37',
        label: '非金融企业债',
        children: [
          { value: '371',
            label: '评级在AA+（含）以上'
          },
          { value: '372',
            label: '评级在AA+至A之间',
          },
          { value: '373',
            label: '评级在A以下或无评级'
          }
        ]
      },
      {
        value: '38',
        label: '其他债券'
      }
    ]
  },
  {
    value: '4',
    label: '票据'
  },
  {
    value: '5',
    label: '股票（权）/基金',
    children: [
      {
        value: '51',
        label: '上市股票',
        children: [
          {
            value: '511',
            label: '流通股'
          },
          {
            value: '512',
            label: '非流通股'
          }
        ]
      },
      {
        value: '52',
        label: '非上市股权'
      },
      {
        value: '53',
        label: '基金'
      }
    ]
  },
  {
    value: '6',
    label: '保单'
  },
  {
    value: '7',
    label: '资产管理产品（不含公募基金）'
  },
  {
    value: '8',
    label: '其他金融质押品'
  },
]
