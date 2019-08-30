// 添加事件结束
const config = require('../configs/index.js');
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value
        }
      )
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason
        }
      )
    }
  )
}

const systemInfo = wx.getSystemInfoSync()
const MenuButtonInfo = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : {}
const platform = systemInfo.platform
const rpx = systemInfo.windowWidth / 750
const windowHeight = systemInfo.windowHeight
const windowWidth = systemInfo.windowWidth
const screenHeight = systemInfo.screenHeight
const screenWidth = systemInfo.screenWidth
const statusBarHeight = systemInfo.statusBarHeight
const menuWidthRange = [78, 98] // 导航右侧按钮宽度(width)可接受范围
const menuHeightRange = [28, 40] // 导航右侧按钮高度(height)可接受范围
const menuTopSpaceRange = [2, 10] // 导航右侧按钮顶部距状态栏距离可接受范围
const menuRightRange = [systemInfo.windowWidth - 20, systemInfo.windowWidth - 5]
let menuWidth = MenuButtonInfo.width || 87 // 默认87
let menuHeight = MenuButtonInfo.height || 32 // 默认32
const menuTop = MenuButtonInfo.top || (statusBarHeight + 4) // 默认使用（statusBarHeight + 4）
let menuTopSpace = menuTop - statusBarHeight
let isMatchSpace = true // 原获取的值是否在范围内
if (menuWidth < menuWidthRange[0] || menuWidth > menuWidthRange[1]) { // 不在可接受范围内，则设定为87px
  menuWidth = 87
}
if (menuHeight < menuHeightRange[0] || menuHeight > menuHeightRange[1]) { // 不在可接受范围内，则设定为32px
  menuHeight = 32
}
if (!MenuButtonInfo.top) {
  isMatchSpace = false
}
if (menuTopSpace < menuTopSpaceRange[0] || menuTopSpace > menuTopSpaceRange[1]) { // 不在可接受范围内，则设定为6px
  menuTopSpace = 4
  isMatchSpace = false
}
const navPaddingBottom = isMatchSpace ? 0 : 4

let menuRight = MenuButtonInfo.right || (systemInfo.windowWidth - 7)
if (menuRight < menuRightRange[0] || menuRight > menuRightRange[1]) {
  menuRight = systemInfo.windowWidth - 7
}
const menuLeft = menuRight - menuWidth
const menuRadius = MenuButtonInfo.radius || Math.ceil(menuHeight / 2)

const navBoxHeight = menuTopSpace * 2 + menuHeight // 导航胶囊上下分别留6px的间隔
const navUseableWidth = menuLeft - 20
const navWrapperHeight = statusBarHeight + navBoxHeight + navPaddingBottom
const env = config.env
let extraBottom = false
const isIos = systemInfo.system.indexOf('iOS') !== -1
const higher = systemInfo.screenHeight > 736
if (isIos && higher) {
  extraBottom = true
}

const nav_data = {
  env,
    platform,
    windowHeight,
    windowWidth,
    screenHeight,
    screenWidth,
    rpx,
    statusBarHeight,
    navBoxHeight,
    menuWidth,
    menuHeight,
    menuLeft,
    menuRight,
    menuTop,
    menuRadius,
    useableWidth: navUseableWidth,
    navHeight: navWrapperHeight,
    navPaddingBottom,
    extraBottom,
    MenuButtonInfo
}

const getNewUrl = url => {
  let _path = url.split('?')[0]
  let _queryStr = url.split('?')[1]
  if (_queryStr) {
    let _queryArr = _queryStr.split('&')
    if (_queryArr.indexOf('fromnav') !== -1 && _queryArr[_queryArr.indexOf('fromnav')] !== 'fromnav') { // 强制将fromnav设为true 且不会重复设置fromnav
      _queryArr[_queryArr.indexOf('fromnav')] = 'fromnav=true'
    } else {
      _queryArr.push('fromnav=true')
    }
    _queryStr = _queryArr.join('&')
  } else {
    _queryStr = 'fromnav=true'
  }
  return [_path, _queryStr].join('?')
}

const assignConfig = function (config, type) { // type[page|component]
  const navigateTo = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.navigateTo(_params)
  }
  const redirectTo = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.redirectTo(_params)
  }
  const reLaunch = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.reLaunch(_params)
  }
  const switchTab = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.switchTab(_params)
  }
  const navigateBack = function (params) {
    wx.navigateBack(params)
  }
  if (type == 'page') { // 页面
    config.navigateTo = navigateTo
    config.redirectTo = redirectTo
    config.reLaunch = reLaunch
    config.switchTab = switchTab
    config.navigateBack = navigateBack
  } else if (type == 'component') { // 组件
    config.methods = config.methods || {}
    config.methods.navigateTo = navigateTo
    config.methods.redirectTo = redirectTo
    config.methods.reLaunch = reLaunch
    config.methods.switchTab = switchTab
    config.methods.navigateBack = navigateBack
  }
  config.data._nav_data_ = nav_data
  return config
}

const originalPage = Page // 保存原来的Page
Page = function(config) { // 覆盖Page变量
  const _config = assignConfig(config, 'page')
  return originalPage(_config)
}

const originalComponent = Component //保存原来的Page
Component = function(config) { // 覆盖Page变量
  const _config = assignConfig(config, 'component')
  return originalComponent(_config)
}
