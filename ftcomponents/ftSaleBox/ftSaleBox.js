// ftcomponents/ftSaleBox/ftSaleBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sales: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        let mode = ''
        let showSales = []
        if (newVal && newVal.length) {
          let val = JSON.parse(JSON.stringify(newVal))
          let flat = (val.length - 1) % 2 === 0 && val.length >= 3
          if (flat) {
            val.splice(2, 0, {empty: true})
            mode = '2'
          } else {
            mode = '1'
          }
          showSales = val
        }
        this.setData({
          mode: mode,
          showSales: showSales
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mode: '',
    showSales: [],
    bgColors1: ['#FDF1F1', '#EEF7F9', '#FDFCF1', '#E4FFE2'],
    bgColors2: ['#FFF3F7', '#FDF1F1', 'transparent', '#EEF7F9', '#FDFCF1', '#E4FFE2']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    saleTap: function (e) {
      const {link} = e.currentTarget.dataset.sale
      if (link) {
        this.navigateTo({
          url: link
        })
      }
    }
  }
})
