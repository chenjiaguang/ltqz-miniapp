// pages/withdrawrecord/withdrawrecord.js 提现记录
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '提现记录',
    list: null,
    page: null,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.fetchData(1)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const {page, loading} = this.data
    if (!page || (page && !page.pn) || (page && page.is_end) || loading) {
      return false
    }
    this.fetchData(parseInt(page.pn) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  fetchData: function(pn = 1) {
    this.setData({
      loading: true
    })
    util.request('/fenxiao/tx_record', {
      pn: pn
    }).then(res => {
      res.data.list.forEach((item) => {
        item.title = '提现到微信零钱'
        item.amount = util.formatMoney(item.amount).showMoney
      })
      if (pn == 1) {
        this.setData({
          list: res.data.list,
          page: res.data.page,
          loading: false
        })
      } else {
        let list = this.data.list
        list = list.concat(res.data.list)
        this.setData({
          list: list,
          page: res.data.page,
          loading: false
        })
      }
    }).catch(err => {
      console.log('err', err)
    })

  }
})