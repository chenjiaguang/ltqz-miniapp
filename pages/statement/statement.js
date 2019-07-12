// pages/statement/statement.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '',
    typeTitle: {
      1: '用户须知',
      2: '免责声明',
      3: '拼团规则'
    },
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { // option.type(1:用户须知，2:免责声明)
    const title = this.data.typeTitle[options.type]
    wx.setNavigationBarTitle({
      title: title || ''
    })
    this.setData({
      navTitle: title || ''
    })
    this.fetchStatement(options.type)
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
  onShareAppMessage: function () {

  },

  fetchStatement: function (type) {
    const urlMap = {
      1: '/article/agreement',
      2: '/article/disclaimer',
      3: '/article/pt_rule'
    }
    const url = urlMap[type]
    util.request(url).then(res => {
      if (res.error == 0 && res.data) {
        let content = res.data
        let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"', 'mdash': '——', 'ldquo': '“', 'rdquo': '”' }
        content = content.replace(/&(lt|gt|nbsp|amp|mdash|ldquo|rdquo);/ig, function (all, t) { return arrEntities[t] }).replace(/<img/ig, '<img style="max-width:100%;height:auto;display:block"').replace(/<section/ig, '<div').replace(/\/section>/ig, '/div>')
        this.setData({
          content: content
        })
      }
    }).catch(err => {

    })
  }
})