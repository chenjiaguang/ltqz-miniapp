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
    },
    stateContentHeight: 0
  },

  ready: function () {
    this.createSelectorQuery().select('#card-statement-content').boundingClientRect(rect => {
      this.setData({
        stateContentHeight: rect.height
      })
    }).exec()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggleMore: function () {
      const {showMore, stateContentHeight} = this.data
      if (!stateContentHeight) {
        return false
      }
      this.setData({showMore: !showMore})
    }
  }
})
