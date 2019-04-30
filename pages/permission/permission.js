// pages/permission/permission.js
import authManager from '../../utils/authManager.js'

Page({
  name: 'permission',
  userStore: true,
  /**
   * 页面的初始数据
   */
  data: {
    disableAuth: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.login()
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

  login() {
    // 登录
    wx.login({
      success: res => { // login调用成功后授权按钮才可用（loginSuccess为true）
        this.setData({ disableAuth: false})
      }
    })
  },

  getUserInfo: function (e) {
    const successCallback = (authSetting) => {
      if (authSetting['scope.userInfo']) {
        // 这里写登录逻辑（通过将signature、encryptedData、iv等信息发送给后端完成登录）
        // 模拟
        setTimeout(() => {
          let token = 'xxx'
          const permissionBack = wx.getStorageSync('permissionBack')
          const url = permissionBack || '/pages/index/index'
          wx.reLaunch({
            url: url,
            success: () => {
              const permissionBackName = permissionBack.split('pages/')[1].split('/')[0]
              let _obj = {}
              _obj['showRelaunchHome.' + permissionBackName] = true
              console.log('this', this)
              const app = getApp()
              app.store.setState(_obj)
            }
          })
        }, 1000)
      } else {
        wx.showModal({
          content: '需要获取您的公开信息(头像、昵称等),请授权后继续使用', //提示的内容
          showCancel: false,
          confirmText: '确定',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
    authManager.getAuthSetting(successCallback) // 更新授权情况(storage)
  }

})