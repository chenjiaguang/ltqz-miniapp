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
    const getAuthSettingCallback = (authSetting) => { // 获取用户授权数据，未授权则跳转授权页面(permission)，授权后才可继续使用
      if (!authSetting['scope.userInfo'] || !authSetting['scope.userLocation']) {
        util.relaunchPermission(options.path, options.query)
      }
    }
    authManager.getAuthSetting(getAuthSettingCallback)
  },
  onShow: function (options) { // 监听用户授权信息是否有变动
    const authSettingChangeCallback = ({ authSetting, changed}) => {
      if (changed.indexOf('scope.userInfo') !== -1 || changed.indexOf('scope.userLocation') !== -1) { // 用户信息授权有变更['scope.userInfo']
        if (authSetting['scope.userInfo'] && authSetting['scope.userLocation']) { // 从未授权变更为授权,重新加载页面栈中最后一个页面(wx.reLaunch 或 wx.switchTab)
          const permissionBack = wx.getStorageSync('permissionBack')
          const url = permissionBack || '/pages/index/index'
          wx.reLaunch({
            url: url
          })
        } else { // 从授权变更为未授权,跳转授权页面(permission),重新授权后才可继续使用(wx.reLaunch)
          if (options.path.indexOf('/permission/permission') === -1) { // 不是授权页面才重定向到授权页面，否则不做任何操作不然permissionBack会被重置为permission页面，授权后无法正常返回原页面
            util.redirectPermission(options.path, options.query)
          }
        }
      }
    }
    authManager.ifAuthSettingChange(authSettingChangeCallback) // 如果微信远端获取的授权数据与本地缓存的不同，则执行authSettingChangeCallback
  }
})