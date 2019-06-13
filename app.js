const config = require('/configs/index.js')
import authManager from '/utils/authManager.js'
import storageHelper from '/utils/storageHelper.js'
import expand from '/utils/expand.js'
import util from '/utils/util.js'
let store = require('/store/index.js')

App({
  globalData: {
    userInfo: null,
    themeColor: '#FF9500', // 设置主题色
    themeModalConfirmColor: '#108EE9'
  },
  config: config,
  store,
  onLaunch: function(options) {
    if (config.env === 'prod') { // 生产环境，关掉调试窗口
      console.error('env：' + config.env + '，be careful')
      wx.setEnableDebug({
        enableDebug: false
      })
    } else { // 开发环境，打开调试窗口，主要是为了视觉上直接分辨是什么环境
      console.log('env：' + config.env + '，fly yourself')
      wx.setEnableDebug({
        enableDebug: true
      })
    }
  },
  onShow: function(options) { // 监听用户授权信息是否有变动
    let token = storageHelper.getStorage('token')
    const getAuthSettingCallback = (authSetting) => { // 获取用户授权数据，未授权则跳转授权页面(permission)，授权后才可继续使用
      if (!token || !authSetting['scope.userInfo'] || !authSetting['scope.userLocation']) {
        util.relaunchPermission(options.path, options.query)
      }
    }
    authManager.getAuthSetting(getAuthSettingCallback)
  }
})