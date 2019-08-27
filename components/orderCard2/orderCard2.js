// components/orderCard2/orderCard2.js
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
    statusText: { // -4普通退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期|6待发货|7已发货
      '-4': '已退款',
      '-3': '已取消',
      '-2': '已取消',
      '-1': '已取消',
      '0': '',
      '1': '待使用',
      '2': '已核销',
      '3': '已核销',
      '4': '',
      '5': '',
      '6': '',
      '7': ''
    },
    statusTextType3: { // -4普通退款|-3为手动下架|-2拼团失败|-1为失效订单|0为待付款|1为待参与|2为待评价|3已评价|4待成团|5已过期|6待发货|7已发货
      '-4': '已退款',
      '-3': '已取消',
      '-2': '已取消',
      '-1': '已取消',
      '0': '',
      '1': '待使用',
      '2': '已完成',
      '3': '已完成',
      '4': '',
      '5': '',
      '6': '待发货',
      '7': '已发货'
    } 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapItem: function () {
      wx.vibrateShort()
    },
    showDeliverModal: function () {
      const {shop_id, order_id} = this.data.item
      this.triggerEvent('showconfirmdeliver', {shop_id, order_id})
    },
    copyText: function (e) {
      const {text} = e.currentTarget.dataset
      wx.setClipboardData({
        data: text
      })
    }
  }
})
