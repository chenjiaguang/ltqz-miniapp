// pages/thememerchant/thememerchant.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '优质商家推荐',
    loading: false,
    list: [],
    page: {},
    loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
      this.setData({navTitle: options.title})
    }
    this.options = options
    this.fetchTheme(options.id, 1)
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
      this.fetchGoods(this.options.id, parseInt(page.pn) + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  fetchTheme: function (id, pn) {
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
    util.request('/home/subject', { id, pn }).then(res => {
      if (res.error == 0 && res.data) {
        let {
          list,
          page
        } = res.data
        let _obj = {}
        _obj.loaded = true
        _obj.page = page
        if (pn === 1) { // 刷新
          _obj.list = list
        } else {
          let oldLen = this.data.list.length
          let newLen = list.length
          for (let i = 0; i < newLen; i++) {
            _obj['list[' + (oldLen + i) + ']'] = list[i]
          }
        }
        this.setData(_obj)
      }
    }).catch(err => {
      console.log('err', err)
      this.setData({
        loading: false
      })
    })
  },

  merchantTap: function (e) {
    const {id} = e.detail
    if (id) {
      this.navigateTo({
        url: '/pages/merchantdetail/merchantdetail?id=' + id
      })
    }
  }
})