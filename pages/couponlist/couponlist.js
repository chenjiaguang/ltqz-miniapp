// pages/couponlist/couponlist.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '我的优惠券',
    list: [],
    page: null,
    loading: false,
    loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    this.fetchCoupon(1)
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
    const {
      page
    } = this.data
    if (page && !page.is_end) {
      this.fetchGoods(parseInt(page.pn) + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

  fetchCoupon: function (pn) {
    const {
      loading,
      page
    } = this.data
    if (loading || (page && page.is_end && pn !== 1)) { // 正在加载 或 最后一页并且不是刷新
      return false
    }
    this.setData({
      loading: true
    })
    let rData = {
      pn: pn
    }
    util.request('/coupon/list', rData).then(res => {
      // this.setData({
      //   loaded: true,
      //   page: {
      //     pn: 1,
      //     is_end: true
      //   }
      // })
      // return false
      if ((res.error === 0 || res.error === '0') && res.data) {
        let {
          list,
          page
        } = res.data
        let _list = list.map(item => {
          const priceObj = util.formatMoney(item.reduction_amount)
          const thresholdObj = util.formatMoney(item.full_amount)
          return {
            id: item.id,
            title: item.title,
            price: priceObj.money,
            show_price: priceObj.showMoney,
            threshold: thresholdObj.money,
            threshold_text: (thresholdObj.money && thresholdObj.money !== '0' && thresholdObj.money != '免费') ? `满${thresholdObj.showMoney}可用` : '无金额门槛',
            tip: item.time_desc,
            extra_detail: item.rule_desc,
            threshold_type: item.threshold_type
          }
        })
        let _obj = {}
        _obj.loaded = true
        _obj.page = page
        if (pn === 1) { // 刷新
          _obj.list = _list
        } else {
          let oldLen = this.data.list.length
          let newLen = _list.length
          for (let i = 0; i < newLen; i++) {
            _obj['list[' + (oldLen + i) + ']'] = _list[i]
          }
        }
        this.setData(_obj)
      }
    }).catch(err => {
      console.log('catch')
    }).finally(res => {
      this.setData({
        loading: false
      })
    })
  }
})