// pages/aftermarket/aftermarket.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '退款/售后',
    list: [],
    loaded: false,
    loading: false,
    page: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchList(1)
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
    const {page, loading} = this.data
    if (!page || (page && !page.pn) || (page && page.is_end) || loading) {
      return false
    }
    this.fetchList(parseInt(page.pn) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

  fetchList(pn = 1) {
    const {loading} = this.data
    if (loading) {
      return false
    }
    let rData = {
      is_refund: true,
      pn: pn
    }
    this.setData({
      loading: true
    })
    util.request('/order/list', rData).then(res => {
      if (res.error === 0 || res.error === '0' && res.data) {
        let _list = this.data.list
        let list = res.data.list
        list.forEach((item) => {
          item.price = util.formatMoney(item.price).showMoney
          item.refund_amount = util.formatMoney(item.refund_amount).showMoney
          let product = item.product || item.huodong || item.vgoods || item.goods
          if (product && product.valid_btime) {
            product.valid_btime = util.formatDateTimeDefault('d', product.valid_btime)
          }
          if (product && product.valid_etime) {
            product.valid_etime = util.formatDateTimeDefault('d', product.valid_etime)
          }
          item.product = product
          item.created_at = util.formatDateTimeDefault('d', item.created_at)
          if (item.ticket) {
            item.ticket.forEach(it => {
              it.price = util.formatMoney(it.price).showMoney
            })
          }
          item.ticket_text = item.ticket.map((item) => {
            return item.name + '×' + item.quantity
          }).join(',')
        })
        let _obj = {}
        if (pn == 1) {
          _obj.list = list
        } else {
          let preLen = _list.length
          let currentNum = list.length
          for (let i = 0; i < currentNum; i++) {
            _obj[`list[${preLen + i}]`] = res.data.list[i]
          }
        }
        _obj.page = res.data.page,
        _obj.loaded = true
        this.setData(_obj)
      }
    }).finally(res => {
      this.setData({
        loading: false
      })
    })
  }
})