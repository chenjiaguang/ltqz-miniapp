// components/orderCard3/orderCard3.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    topBlock: {
      type: Boolean,
      value: true
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
    tapItem: function () {
      wx.vibrateShort()
    },
    showRejectModal: function () {
      const {shop_id, order_id} = this.data.item
      this.triggerEvent('showrejectmodal', {shop_id, order_id})
    },
    confirmRefund: function () {
      console.log('confirmRefund')
      const {shop_id, order_id} = this.data.item
      this.triggerEvent('confirmrefund', {shop_id, order_id})
    }
  }
})
