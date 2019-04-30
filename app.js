//app.js
const config = require('/configs/index.js')
import authManager from '/utils/authManager.js'
import expand from '/utils/expand.js'
import util from '/utils/util.js'
let store = require('/store/index.js')

App({
  globalData: {
    userInfo: null
  },
  config: null,
  store,
  onLaunch: function (options) {
    console.log('launch_options', options)
    const getAuthSettingCallback = (authSetting) => { // 获取用户授权数据，未授权则跳转授权页面(permission)，授权后才可继续使用
      if (!authSetting['scope.userInfo']) {
        util.goPermission(options.path, options.query)
      }
    }
    authManager.getAuthSetting(getAuthSettingCallback)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function (options) { // 监听用户授权信息是否有变动
    console.log('show_options', options)
    const authSettingChangeCallback = ({ authSetting, changed}) => {
      wx.showToast({
        title: '改变了',
        icon: 'none'
      })
      console.log('authSettingChangeCallback', authSetting, changed)
      if (changed.indexOf('scope.userInfo') !== -1) { // 用户信息授权有变更['scope.userInfo']
        if (authSetting['scope.userInfo']) { // 从未授权变更为授权,重新加载页面栈中最后一个页面(wx.reLaunch 或 wx.switchTab)
          const permissionBack = wx.getStorageSync('permissionBack')
          const url = permissionBack || '/pages/index/index'
          wx.reLaunch({
            url: url
          })
        } else { // 从授权变更为未授权,跳转授权页面(permission),重新授权后才可继续使用(wx.reLaunch)
          util.goPermission(options.path, options.query)
        }
      }
    }
    authManager.ifAuthSettingChange(authSettingChangeCallback) // 如果微信远端获取的授权数据与本地缓存的不同，则执行authSettingChangeCallback
  }
})