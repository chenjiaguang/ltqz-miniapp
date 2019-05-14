import authManager from './authManager.js'
import storageHelper from './storageHelper.js'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatMoney = n => {
  return n == 0 ? 0 : n.toFixed(2)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getUrl = (path, query) => {
  let url = path
  if (path.indexOf('?') == -1) {
    url += '?'
  }
  for (let key in query) {
    url += '&' + key + '=' + query[key]
  };
  return url
}

const relaunchPermission = (path, options) => {
  storageHelper.setStorage('permissionBack', '/' + getUrl(path, options))
  wx.reLaunch({
    url: '/pages/permission/permission'
  })
}

const redirectPermission = (path, options) => {
  storageHelper.setStorage('permissionBack', '/' + getUrl(path, options))
  wx.redirectTo({
    url: '/pages/permission/permission'
  })
}

const isJsonString = str => {
  try {
    if (typeof JSON.parse(str) == 'object') {
      return true
    }
  } catch (e) {

  }
  return false
}

const checkLogin = () => {
  const token = storageHelper.getStorage('token')
  if (token) {
    return true
  }
  const getAuthSettingCallback = (authSetting) => { // 获取用户授权数据，未授权则跳转授权页面(permission)，授权后才可继续使用
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    if (authSetting['scope.userInfo'] && authSetting['scope.userLocation']) { // 两个授权已满足，只更新token即可
      if (page && page.route.indexOf('/permission/permission') === -1) { // 不是授权、登录页面（permission）
        storageHelper.setStorage('permissionBack', '/' + getUrl(page.route, page.options))
      }
      wx.redirectTo({
        url: '/pages/permission/permission?type=update_token' // 传入update_token时，页面只走更新token的流程
      })
    } else { // 两个授权未满足,需获取授权信息
      if (page && page.route.indexOf('/permission/permission') === -1) { // 不是授权、登录页面（permission）
        storageHelper.setStorage('permissionBack', '/' + getUrl(page.route, page.options))
      }
      wx.redirectTo({
        url: '/pages/permission/permission'
      })
    }
  }
  authManager.getAuthSetting(getAuthSettingCallback)
  return false
}

const request = (url, data, config = {}) => {
  const app = getApp()
  const apiVersion = (config && config.apiVersion) ? config.apiVersion : (app.config.apiVersion || '/v1')
  const token = (config && config.token) || storageHelper.getStorage('token') || ''
  let _data = Object.assign({}, data, {
    token: token
  })
  console.log('apiVersion', apiVersion)
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.config.baseUrl + apiVersion + url,
      data: _data,
      method: (config && config.method) || 'POST', // 使用传入的method值，或者默认的post
      header: {
        'fromOrigin': 'miniapp',
        'version': apiVersion,
        'content-type': (config && config.contentType) || 'application/json', // 使用传入的contentType值，或者默认的application/json
        'token': token, // 使用传入的token值，或者全局的token，都没有则默认空字符串
      },
      success: function(res) {
        if (res.data.error && (res.data.error == 401 || res.data.error == 403)) {
          storageHelper.setStorage('token', '')
          checkLogin()
          reject(res.data || res) // 返回错误提示信息
          return
        }
        if (res.data.msg && res.data.error !== 0 && res.data.error !== '0') {
          reject(res.data || res) // 返回错误提示信息
          return
        }
        resolve(res.data || res)
      },
      fail: function(res) {
        if (res && res.errMsg && res.errMsg === 'request:fail') { // 小程序请求失败，可以在这里检查是否联网，处理断网

        }
        reject(res) // 返回错误提示信息
      },
      complete: function(res) {

      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  isJsonString,
  relaunchPermission,
  redirectPermission,
  request
}