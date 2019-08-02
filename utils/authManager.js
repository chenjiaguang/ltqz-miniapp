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
  getAuthSetting: function (successCall, failCall, completeCall) {
    wx.getSetting({
      success: res => {
        successCall(res.authSetting)
      },
      fail: res => {
        failCall && failCall(res)
      },
      complete: res => {
        completeCall && completeCall(res)
      }
    })
  }
}

module.exports = authManager
