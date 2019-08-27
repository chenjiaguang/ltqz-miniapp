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

const checkLogin = (action) => {
  const token = storageHelper.getStorage('token')
  if (token) {
    return true
  }
  if (action) {
    if (action == 'navPermission') { // 直接跳转登录页面
      wx.navigateTo({
        url: '/pages/permission/permission'
      })
    } else if (typeof action == 'function') { // 传入的是函数
      action()
    } else if (action == 'loginModal') { // 显示登录提示弹窗
      const pages = getCurrentPages()
      if (pages && pages.length) {
        const page = pages[pages.length - 1]
        const loginModal = page.selectComponent('#c-login-modal')
        loginModal && loginModal.showModal && loginModal.showModal()
      }
    }
  }
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

const relogin = () => {
  const app = getApp()
  if ((app && app.globalData && app.globalData.loging) || !storageHelper.getStorage('token')) { // 只在全局未执行登录操作 且 原先就已经登录过(存在token)时才执行更新token操作
    return false
  }
  app.globalData.loging = true
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  wx.login({
    success: res => {
      request('/login', {code: res.code}).then(res => {
        if ((res.error === 0 || res.error === '0') && res.data) {
          const {
            token,
            id,
            avatar,
            nick_name,
            phone
          } = res.data
          storageHelper.setStorage('uid', id)
          storageHelper.setStorage('uavatar', avatar || '')
          storageHelper.setStorage('unickname', nick_name || '')
          storageHelper.setStorage('uphone', phone || '')
          if (phone) { // 有手机号
            storageHelper.setStorage('temToken', '')
            storageHelper.setStorage('token', token)
            const url = ('/' + getUrl(page.route, page.options)) || '/pages/index/index'
            wx.reLaunch({
              url: url,
              success: res => {
                wx.showToast({
                  title: '您的登录信息过期，已自动为您更新',
                  icon: 'none'
                })
              }
            })
          }
        }
      }).catch(err => {
        storageHelper.setStorage('token', '')
      }).finally(res => {
        app.globalData.loging = false
      })
    }
  })
}

const request = (url, data, config = {}) => {
  const app = getApp()
  const apiVersion = (config && config.apiVersion) || app.config.apiVersion || '/v1'
  const token = (config && config.token) || storageHelper.getStorage('token') || ''
  const timeStamp = new Date().getTime()
  return new Promise((resolve, reject) => {
    const requestTask = wx.request({
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
          storageHelper.setStorage('permissionTimeStamp', new Date().getTime())
          relogin()
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
        if (res.data && (res.data.error === 0 || res.data.error === '0') && token && url !== '/fenxiao/bind_parent') { // 绑定分销员
          const fenxiaoid_unbind = storageHelper.getStorage('fenxiaoid_unbind')
          if (fenxiaoid_unbind) {
            const app = getApp()
            if (app.globalData && app.globalData.fxBindingTask) {
              app.globalData.fxBindingTask.abort()
            }
            request('/fenxiao/bind_parent', {parent_id: fenxiaoid_unbind}, {dontToast: true, getRequestTask: function (task) {
              app.globalData.fxBindingTask = task
            }}).then(res => {
              if (res.error === 0 || res.error === '0') {
                storageHelper.setStorage('fenxiaoid_binded', fenxiaoid_unbind)
                storageHelper.setStorage('fenxiaoid_unbind', '')
              }
            }).finally(res => {
              app.globalData.fxBindingTask = null
            })
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
    if (config.getRequestTask) {
      config.getRequestTask(requestTask)
    }
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
  checkLogin: checkLogin,
  getUrl,
  formatTime: formatTime,
  isJsonString,
  relaunchPermission,
  request,
  formatMoney,
  backAndToast,
  formatDateTimeDefault,
  isVersionGreater
}