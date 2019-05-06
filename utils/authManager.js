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
  authSettingStorage: isJsonString(wx.getStorageSync('authSetting')) ? JSON.parse(wx.getStorageSync('authSetting')) : null,
  getAuthSetting: function (successCall) {
    wx.getSetting({
      success: res => {
        this.updateAuthSetting(res.authSetting) // 更新本地存储的authSetting
        successCall(res.authSetting)
      }
    })
  },
  ifAuthSettingChange: function (callback) {
    wx.getSetting({
      success: res => {
        let authSetting = res.authSetting
        if (authSetting && Object.keys(authSetting).length > 0) { // 存在
          let _authSetting = this.authSettingStorage
          let _changedArr = []
          for (let scope in authSetting) {
            if (!_authSetting || authSetting[scope] !== _authSetting[scope]) {
              _changedArr.push(scope)
            }
          }
          if (_changedArr.length > 0) { // 有改变
            this.updateAuthSetting(authSetting) // 更新本地存储的authSetting
            callback({ authSetting, changed: _changedArr})
          }
        }
      }
    })
  },
  updateAuthSetting: function (authSetting) {
    const _authSetting = JSON.stringify(authSetting)
    wx.setStorageSync('authSetting', _authSetting)
    this.authSettingStorage = authSetting
  }
}

module.exports = authManager
