module.exports = {
  // 在此处记录本地存储字段对应的意义（作用），方便后期维护
  allowList: [
    'token', // 记录当前用户的身份验证字符串
    'userInfo', // 记录用户基本信息,Object包括（avatar、nick_name）
    'permissionBack', // 记录用户跳转进入permission页面前的页面信息
    'authSetting', // 记录用户已授权信息，避免每次获取已授权信息都要调取微信接口（微信的接口是异步的）
  ],
  setStorage: function (key, value) {
    if (this.allowList.indexOf(key) === -1) { // allowList不存在,则会提醒开发者添加相应的说明
      console.log('setStorage:请在allowList中添加相应的字段说明，增加易读性')
    }
    wx.setStorageSync(key, value)
  },
  getStorage: function (key) {
    if (this.allowList.indexOf(key) === -1) { // allowList不存在,则会提醒开发者添加相应的说明
      console.log('getStorage:请在allowList中添加相应的字段说明，增加易读性')
    }
    return wx.getStorageSync(key)
  }
}