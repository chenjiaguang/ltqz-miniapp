// pages/refundapply/refundapply.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '退款申请',
    refunding: false // 是否正在申请退款
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id} = options
    this.getRefundData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

  getRefundData: function () {
    const pages = getCurrentPages()
    const prePage = pages[pages.length - 2]
    if (prePage && prePage.refundData) {
      this.setData(prePage.refundData)
    }
  },

  refund: function (e) {
    console.log('refund', e)
    const {formId} = e.detail
    const {can_refund, order_id, refunding} = this.data
      if (refunding || !can_refund) {
        return false
      }
      this.setData({refunding: true})
      util.request('/order/refund', {
        form_id: formId,
        id: order_id
      }).then(res => {
        if (res.error == 0) { // 退款成功
          // wx.showToast({
          //   title: res.msg || '退款成功，退款金额将于1-2个工作日原路退回您的付款账户',
          //   icon: 'none',
          //   duration: 3000,
          // })
          this.refreshOrder(res.msg || '退款成功，退款金额将于1-2个工作日原路退回您的付款账户')
        } else {
          if (res.msg) {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(res => {
        this.setData({refunding: false})
      })
  },

  refreshOrder: function (msg) {
    const pages = getCurrentPages()
    const prePage = pages[pages.length - 2]
    if (prePage.name === 'orderdetail') {
      this.navigateBack({
        delta: 1,
        complete: () => {
          setTimeout(() => {
            const _pages = getCurrentPages()
            const _page = _pages[_pages.length - 1]
            if (_page.name === 'orderdetail') { // 订单详情
              wx.showToast({
                title: msg,
                icon: 'none',
                duration: 3000
              })
            }
          }, 500)
        }
      })
    } else {
      this.redirectTo({
        url: '/pages/orderdetail/orderdetail?id=' + this.data.order_id,
        complete: () => {
          setTimeout(() => {
            const _pages = getCurrentPages()
            const _page = _pages[_pages.length - 1]
            if (_page.name === 'orderdetail') { // 订单详情
              wx.showToast({
                title: msg,
                icon: 'none',
                duration: 3000
              })
            }
          }, 500)
        }
      })
    }
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].name === 'orderlist') { // 订单列表页
        pages[i].refresh && pages[i].refresh()
      } else if (pages[i].name === 'orderdetail') { // 订单详情页
        pages[i].fetchOrder && pages[i].fetchOrder(pages[i].options.id)
      }
    }
  }
})