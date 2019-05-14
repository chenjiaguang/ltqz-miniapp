// components/orderCard/orderCard.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail() {
      wx.navigateTo({
        url: '/pages/orderdetail/orderdetail'
      })
    },
    goComment() {
      wx.navigateTo({
        url: '/pages/orderComment/orderComment'
      })
    },
    goPay() {

    },
    goTicket() {
      wx.navigateTo({
        url: '/pages/goodsticket/goodsticket'
      })
    }
  }
})