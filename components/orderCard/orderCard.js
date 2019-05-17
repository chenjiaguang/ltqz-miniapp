// components/orderCard/orderCard.js
const util = require('../../utils/util.js')
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
        url: '/pages/orderdetail/orderdetail?id=' + this.data.item.order_id
      })
    },
    goComment() {
      wx.navigateTo({
        url: '/pages/orderComment/orderComment?id=' + this.data.item.order_id
      })
    },
    goPay() {
      util.request('/order/pay', {
        id: this.data.item.order_id
      }).then(res => {
        let data = Object.assign({}, res.data, {
          success: () => {
            wx.showToast({
              title: '支付成功',
              icon: 'none'
            })
          }
        })
        wx.requestPayment(data)
      }).catch(err => {})
    },
    goTicket() {
      wx.navigateTo({
        url: '/pages/goodsticket/goodsticket?id=' + this.data.item.order_id
      })
    }
  }
})