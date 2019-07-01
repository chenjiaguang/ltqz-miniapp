// ftcomponents/ftSaleBox/ftSaleBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sales: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgColors1: ['#FDF1F1', '#EEF7F9', '#FDFCF1', '#E4FFE2'],
    bgColors2: ['#FFF3F7', '#FDF1F1', '#EEF7F9', '#FDFCF1', '#E4FFE2']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    saleTap: function (e) {
      const {link} = e.currentTarget.dataset.sale
      if (link) {
        wx.navigateTo({
          url: link
        })
      }
    }
  }
})
