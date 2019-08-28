// 添加事件结束
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

const originalPage = Page // 保存原来的Page
Page = function(config) { // 覆盖Page变量
  config.navigateTo = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.navigateTo(_params)
  }
  config.redirectTo = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.redirectTo(_params)
  }
  config.reLaunch = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.reLaunch(_params)
  }
  config.switchTab = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.switchTab(_params)
  }
  config.navigateBack = function (params) {
    wx.navigateBack(params)
  }
  return originalPage(config)
}

const originalComponent = Component //保存原来的Page
Component = function(config) { // 覆盖Page变量
  config.methods = config.methods || {}
  config.methods.navigateTo = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.navigateTo(_params)
  }
  config.methods.redirectTo = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.redirectTo(_params)
  }
  config.methods.reLaunch = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.reLaunch(_params)
  }
  config.methods.switchTab = function (params) {
    let _url = getNewUrl(params.url)
    let _params = Object.assign({}, params, {url: _url})
    wx.switchTab(_params)
  }
  config.methods.navigateBack = function (params) {
    wx.navigateBack(params)
  }
  return originalComponent(config)
}
