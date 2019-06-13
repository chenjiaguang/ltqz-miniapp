// components/orderCard/orderCard.js
const util = require('../../utils/util.js')
const storageHelper = require('../../utils/storageHelper.js')
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
            util.request('/order/pay_result', {
              id: this.data.item.order_id
            }).then(res => {
              if (res.error == 0) { // 查询结果为已支付
                wx.showToast({
                  title: '支付成功',
                  icon: 'none'
                })
                this.triggerEvent('orderListRefresh')
              } else {
                if (res.msg) {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none'
                  })
                }
              }
            }).catch(err => {
              console.log('err', err)
            })
          }
        })
        wx.requestPayment(data)
      }).catch(err => {
        console.log('err', err)
      })
    },
    goTicket() {
      wx.navigateTo({
        url: '/pages/goodsticket/goodsticket?id=' + this.data.item.order_id
      })
    },
    shareTap: function (e) {
      const { hd_id, tuan_id} = this.data.item
      this.triggerEvent('share', {
        hd_id,
        pt_id: tuan_id
      })
    }
  }
})