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
    statusText: { // -3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期
      '-3': '已取消',
      '-2': '已取消',
      '-1': '已取消',
      '0': '待付款',
      '1': '待使用',
      '2': '待评价',
      '3': '已完成',
      '4': '拼团中',
      '5': '已取消'
    },
    statusClass: { // -3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期
      '-3': 'state-normal',
      '-2': 'state-normal',
      '-1': 'state-normal',
      '0': 'state-red',
      '1': 'state-orange',
      '2': 'state-normal',
      '3': 'state-normal',
      '4': 'state-orange',
      '5': 'state-normal'
    }
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
      const { product_id, tuan_id} = this.data.item
      this.triggerEvent('share', {
        product_id,
        pt_id: tuan_id
      })
    }
  }
})