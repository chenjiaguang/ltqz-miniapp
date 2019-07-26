// pages/permission/permission.js
import authManager from '../../utils/authManager.js'
import storageHelper from '../../utils/storageHelper.js'
import util from '../../utils/util.js'

Page({
  name: 'permission',
  userStore: true,
  /**
   * 页面的初始数据
   */
  data: {
    showType: '', // type：['permission','update_token']
    disableAuth: true,
    authUserInfo: false,
    authUserLocation: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    authManager.getAuthSetting((authSetting) => {
      if (!!authSetting['scope.userInfo'] && !!authSetting['scope.userLocation']) {
        // token过期或不存在token时进入的该页面，则不显示授权相关信息，直接重新登录
        this.setData({
          showType: 'update_token'
        })
        this.updateToken()
      } else { // 走授权登录流程
        this.setData({
          showType: 'permission'
        })
        this.login()
        let _obj = {}
        _obj.authUserInfo = !!authSetting['scope.userInfo']
        _obj.authUserLocation = !!authSetting['scope.userLocation']
        this.setData(_obj)
      }
    })
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
    storageHelper.setStorage('permissionTimeStamp', new Date().getTime())
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

  updateToken: function() {
    console.log('updateToken')
    wx.login({
      success: res => { // login调用成功后授权按钮才可用（loginSuccess为true）
        this.userLogin({
          code: res.code
        })
      }
    })
  },

  login() {
    // 登录
    wx.login({
      success: res => { // login调用成功后授权按钮才可用（loginSuccess为true）
        this.setData({
          disableAuth: false
        })
        this.code = res.code
      }
    })
  },

  getUserInfo: function(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      this.setData({
        authUserInfo: true
      })
      const {
        encryptedData,
        iv,
        rawData,
        signature
      } = e.detail
      const {
        avatarUrl,
        gender,
        nickName
      } = e.detail.userInfo
      const logingInfo = {
        encryptedData,
        iv,
        rawData,
        signature,
        avatarUrl,
        gender,
        nickName
      }
      const successCallback = (authSetting) => {
        this.authGetting = false // 授权完成后重置正在授权为false
        if (authSetting['scope.userInfo'] && authSetting['scope.userLocation']) {
          this.userLogin(logingInfo)
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
              this.userLogin(logingInfo)
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
                      this.userLogin(logingInfo)
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
      if (this.authGetting) { // 如果正在获取授权，不重复获取
        return false
      }
      this.authGetting = true
      authManager.getAuthSetting(successCallback) // 更新授权情况(storage)
    } else {
      this.setData({
        authUserInfo: false
      })
    }
  },

  userLogin: function(logingInfo) {
    // 这里写登录逻辑（通过将signature、encryptedData、iv等信息发送给后端完成登录）
    // 模拟
    if (this.loging) { // 判断是否正在调用登录接口，避免重复调用登录接口后提示code已使用的问题
      return false
    }
    this.setData({
      authUserInfo: true,
      authUserLocation: true
    })
    let rData = Object.assign({}, {
      code: this.code
    }, logingInfo)
    this.loging = true
    util.request('/login', rData).then(res => {
      this.loging = false
      if ((res.error === 0 || res.error === '0') && res.data) {
        const app = getApp()
        const {
          token,
          id,
          avatar,
          nick_name,
          phone
        } = res.data
        storageHelper.setStorage('token', token)
        storageHelper.setStorage('uid', id)
        storageHelper.setStorage('uavatar', avatar || '')
        storageHelper.setStorage('unickname', nick_name || '')
        storageHelper.setStorage('uphone', phone || '')
        const permissionBack = storageHelper.getStorage('permissionBack')
        const url = permissionBack || '/pages/index/index'
        wx.reLaunch({
          url: url,
          success: () => {
            if (url.indexOf('pages/index/index') !== -1 || url.indexOf('pages/mine/mine') !== -1) { // 本身是tabbar中的页面(首页、个人中心页面)，则不显示首页按钮
              return false
            }
            const permissionBackName = url.split('pages/')[1].split('/')[0]
            let _obj = {}
            _obj['showRelaunchHome.' + permissionBackName] = true
            const app = getApp()
            app.store.setState(_obj)
          }
        })
      }
    }).catch(err => {
      this.loging = false
      if (err.error == 1 && this.data.showType === 'update_token') {
        this.login()
        this.setData({
          showType: 'permission'
        })
      }
    })
  }

})