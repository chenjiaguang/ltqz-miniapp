import storageHelper from './storageHelper.js'

const isJsonString = str => {
  try {
    if (typeof JSON.parse(str) == 'object') {
      return true
    }
  } catch (e) {

  }
  return false
}

const authManager = {
  getAuthSetting: function (successCall) {
    wx.getSetting({
      success: res => {
        successCall(res.authSetting)
      }
    })
  }
}

module.exports = authManager
