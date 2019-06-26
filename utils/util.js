import authManager from './authManager.js'
import storageHelper from './storageHelper.js'

const secondToClock = seconds => {
  if (seconds <= 0) {
    return '00:00:00'
  }
  let hour = seconds / 3600
  let min = (seconds % 3600) / 60
  let second = seconds % 60
  hour = (hour >= 10) ? parseInt(hour) : ('0' + parseInt(hour))
  min = (min >= 10) ? parseInt(min) : ('0' + parseInt(min))
  second = (second >= 10) ? second : ('0' + second)
  return [hour, min, second].join(':')
}

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
  let money = 0
  let showMoney = 0
  switch (n) {
    case null:
    case 0:
    case '0':
    case '':
      money = 0
      showMoney = 0
      break;
    default:
      money = parseInt(n)
      showMoney = (parseInt(n) / 100).toFixed(2)
  }
  return {
    money,
    showMoney
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDateTimeDefault = (dfmt, dateString) => {
  if (dfmt == 'd') {
    return dateString.split(' ')[0]
  } else if (dfmt == 'm') {
    let split = dateString.split(':')
    return split[0] + ':' + split[1]
  } else {
    return dateString
  }
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
  let url = '/' + getUrl(path, options)
  if (url.indexOf('pages/permission/permission') > -1) {
    //防止出现无限循环login
    let oldLoginBack = storageHelper.getStorage('permissionBack')
    //如果有旧的回跳地址 则使用旧的 没有则跳转到首页
    url = oldLoginBack || '/pages/index/index'
  }
  storageHelper.setStorage('permissionBack', url)
  wx.reLaunch({
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
    relaunchPermission(page.route, page.options)
  }
  authManager.getAuthSetting(getAuthSettingCallback)
  return false
}
const showErrorToast = (msg) => {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}
const backAndToast = (msg) => {
  if (getCurrentPages().length > 1) {
    wx.navigateBack({
      delta: 1,
      complete: () => {
        setTimeout(() => {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }, 500)
      }
    })
  } else {
    wx.reLaunch({
      url: '/pages/index/index',
      complete: () => {
        setTimeout(() => {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }, 500)
      }
    })
  }
}

const request = (url, data, config = {}) => {
  const app = getApp()
  const apiVersion = (config && config.apiVersion) || app.config.apiVersion || '/v1'
  const token = (config && config.token) || storageHelper.getStorage('token') || ''
  const timeStamp = new Date().getTime()
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.config.baseUrl + apiVersion + url,
      data: data,
      method: (config && config.method) || 'POST', // 使用传入的method值，或者默认的post
      header: {
        'fromOrigin': 'miniapp',
        'version': apiVersion,
        'content-type': (config && config.contentType) || 'application/json', // 使用传入的contentType值，或者默认的application/json
        'token': token, // 使用传入的token值，或者全局的token，都没有则默认空字符串
      },
      success: function(res) {
        if (res.data.error && (res.data.error == 401)) {
          const permissionTimeStamp = storageHelper.getStorage('permissionTimeStamp')
          if (permissionTimeStamp && timeStamp < permissionTimeStamp) {
            return false
          }
          storageHelper.setStorage('token', '')
          storageHelper.setStorage('permissionTimeStamp', new Date().getTime())
          checkLogin()
          reject(res.data || res) // 返回错误提示信息
          return
        }
        if (res.data.msg && res.data.error !== 0 && res.data.error !== '0') {
          if (!config.dontToast) {
            showErrorToast(res.data.msg)
            reject(res.data || res) // 返回错误提示信息
            return
          }
        }
        setTimeout(() => {
          resolve(res.data || res)
        }, 0)
      },
      fail: function(res) {
        if (res && res.errMsg && res.errMsg === 'request:fail') { // 小程序请求失败，可以在这里检查是否联网，处理断网
          showErrorToast('网络异常，请检查网络设置')
        }
        reject(res) // 返回错误提示信息
      },
      complete: function(res) {

      }
    })
  })
}

const isVersionGreater = (currentVer, ver) => {
  const currentVerArr = currentVer.split('.')
  const verArr = ver.split('.')
  if (currentVerArr.length != verArr.length) { // 无法比较
    return false
  }
  let greater = false
  if (currentVerArr[0] > verArr[0] || (currentVerArr[0] == verArr[0] && currentVerArr.length == 1)) {
    return true
  } else if (currentVerArr[0] < verArr[0]) {
    return false
  } else if (currentVerArr.length == 1) {
    return currentVerArr[0] >= verArr[0]
  } else {
    return isVersionGreater(currentVerArr.filter((item, idx) => idx > 0).join('.'), verArr.filter((item, idx) => idx > 0).join('.'))
  }
}

module.exports = {
  checkLogin,
  formatTime: formatTime,
  isJsonString,
  relaunchPermission,
  request,
  formatMoney,
  backAndToast,
  formatDateTimeDefault,
  isVersionGreater
}