// pages/activitymanager/activitymanager.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '商品管理',
    id: '',
    list: [],
    page: null,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
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
  onShow: function() {},

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
    const {page} = this.data
    if (!page || (page && !page.pn) || (page && page.is_end) || loading) {
      return false
    }
    this.fetchData(parseInt(page.pn) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  fetchData: function(pn = 1) {
    this.setData({
      loading: true
    })
    util.request('/admin/product/list', {
      pn: pn,
      id: this.data.id
    }).then(res => {
      res.data.list.forEach((item) => {
        item.valid_btime = item.valid_btime ? util.formatDateTimeDefault('m', item.valid_btime) : ''
        item.valid_etime = item.valid_etime ? util.formatDateTimeDefault('m', item.valid_etime) : ''
        item.js_price = util.formatMoney(item.js_price).showMoney
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