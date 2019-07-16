// pages/hexiaosetting/hexiaosetting.js
const util = require('../../utils/util.js')
const app = getApp()
let themeColor = '#FFFFFF'
if (app) {
  themeColor = app.globalData.themeColor
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '核销码设置',
    navBg: themeColor || '#FFFFFF',
    id: '',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    const pages = getCurrentPages()
    const prePage = pages[pages.length - 2]
    if (prePage && prePage.provideCode) {
      const code = prePage.provideCode()
      if (code) {
        this.setData({
          code
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  submit() {
    util.request('/admin/hx/change_code', {
      id: this.data.id,
      hx_code: this.data.code
    }).then(res => {
      util.backAndToast('核销密码修改成功啦')
    }).catch(err => {
      console.log('err', err)
    })
  }
})