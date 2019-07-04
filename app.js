const config = require('/configs/index.js')
import authManager from '/utils/authManager.js'
import storageHelper from '/utils/storageHelper.js'
import expand from '/utils/expand.js'
import util from '/utils/util.js'
let store = require('/store/index.js')
const systemInfo = wx.getSystemInfoSync()
const pageNavigationCustomable = util.isVersionGreater(systemInfo.version, '7.0.0') || (util.isVersionGreater(systemInfo.SDKVersion, '2.5.2') && systemInfo.platform === 'devtools')
const statusBarHeight = systemInfo.statusBarHeight
const MenuButtonInfo = wx.getMenuButtonBoundingClientRect()
const menuTopSpace = MenuButtonInfo.top - statusBarHeight
const menuHeight = MenuButtonInfo.height
const navBoxHeight = menuTopSpace * 2 + MenuButtonInfo.height // 导航胶囊上下分别留6px的间隔
const navUseableWidth = MenuButtonInfo.left - 20
const navWrapperHeight = statusBarHeight + navBoxHeight

App({
  globalData: {
    userInfo: null,
    themeColor: '#FF9500', // 设置主题色
    themeModalConfirmColor: '#108EE9',
    platform: systemInfo.platform,
    customNav: {
      useable: pageNavigationCustomable,
      statusBarHeight: systemInfo.statusBarHeight,
      menuHeight: menuHeight,
      navBoxHeight: navBoxHeight,
      useableWidth: navUseableWidth,
      navHeight: navWrapperHeight
    }
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