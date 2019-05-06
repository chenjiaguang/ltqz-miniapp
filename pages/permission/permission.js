// pages/permission/permission.js
import authManager from '../../utils/authManager.js'

Page({
  name: 'permission',
  userStore: true,
  /**
   * 页面的初始数据
   */
  data: {
    disableAuth: true,
    authUserInfo: false,
    authUserLocation: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.login()
    const authSetting = authManager.authSettingStorage
    let _obj = {}
    _obj.authUserInfo = !!authSetting['scope.userInfo']
    _obj.authUserLocation = !!authSetting['scope.userLocation']
    this.setData(_obj)
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
    if (e.detail.errMsg === 'getUserInfo:ok') {
      this.setData({
        authUserInfo: true
      })
      const successCallback = (authSetting) => {
        if (authSetting['scope.userInfo'] && authSetting['scope.userLocation']) {
          this.userLogin()
        } else if (!authSetting['scope.userInfo']) {
          wx.showModal({
            content: '需要获取您的公开信息(头像、昵称等),请授权后继续使用', //提示的内容
            showCancel: false,
            confirmText: '确定'
          })
          this.setData({
            authUserInfo: false
          })
        } else if (authSetting['scope.userInfo'] && authSetting['scope.userLocation'] !== false) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.userLogin()
            }
          })
          this.setData({
            authUserLocation: false
          })
        } else if (authSetting['scope.userInfo'] && authSetting['scope.userLocation'] === false) {
          wx.showModal({
            content: '需要获取您的位置权限，以提供地图服务,请授权后继续使用', //提示的内容
            showCancel: true,
            confirmText: '去授权',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    const authSetting = res.authSetting
                    let _obj = {}
                    _obj.authUserInfo = !!authSetting['scope.userInfo']
                    _obj.authUserLocation = !!authSetting['scope.userLocation']
                    this.setData(_obj)
                    if (authSetting['scope.userInfo'] && authSetting['scope.userLocation']) {
                      this.userLogin()
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          this.setData({
            authUserLocation: false
          })
        }
      }
      authManager.getAuthSetting(successCallback) // 更新授权情况(storage)
    } else {
      this.setData({
        authUserInfo: false
      })
    }
  },

  userLogin: function (userInfo) {
    // 这里写登录逻辑（通过将signature、encryptedData、iv等信息发送给后端完成登录）
    // 模拟
    this.setData({
      authUserInfo: true,
      authUserLocation: true
    })
    setTimeout(() => {
      let token = 'xxx'
      const permissionBack = wx.getStorageSync('permissionBack')
      const url = permissionBack || '/pages/index/index'
      wx.reLaunch({
        url: url,
        success: () => {
          if (url.indexOf('pages/index/index') !== -1) { // 本身是首页，则不显示首页按钮
            return false
          }
          const permissionBackName = url.split('pages/')[1].split('/')[0]
          let _obj = {}
          _obj['showRelaunchHome.' + permissionBackName] = true
          const app = getApp()
          app.store.setState(_obj)
        }
      })
    }, 1000)
  }

})