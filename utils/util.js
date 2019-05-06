const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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
  wx.setStorageSync('permissionBack', '/' + getUrl(path, options))
  wx.reLaunch({
    url: '/pages/permission/permission'
  })
}

const redirectPermission = (path, options) => {
  wx.setStorageSync('permissionBack', '/' + getUrl(path, options))
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

module.exports = {
  formatTime: formatTime,
  isJsonString,
  relaunchPermission,
  redirectPermission
}
