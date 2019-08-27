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
    showMore: false
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
