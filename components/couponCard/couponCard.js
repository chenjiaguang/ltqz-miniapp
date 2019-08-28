// components/couponCard/couponCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showMore: false,
    thresholdTypeText: {
      '1': '无门槛：',
      '2': '指定商品：',
      '3': '指定商家：'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggleMore: function () {
      const {showMore} = this.data
      this.setData({showMore: !showMore})
    }
  }
})
