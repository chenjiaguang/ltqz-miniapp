import storageHelper from './storageHelper.js'
module.exports = {
  upload(filePath) {
    const app = getApp()
    const apiVersion = app.config.apiVersion || '/v1'
    // const token = storageHelper.getStorage('token') || ''
    const token = '53876bfbe2f70458f4bdd662d8d4e695'
    const url = '/upload/image'
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        name: 'image',
        url: app.config.baseUrl + apiVersion + url,
        filePath: filePath,
        header: {
          'fromOrigin': 'miniapp',
          'version': apiVersion,
          'token': token, // 使用传入的token值，或者全局的token，都没有则默认空字符串
        },
        success: function(res) {
          resolve(JSON.parse(res.data))
        },
        fail: function(res) {
          reject(res) // 返回错误提示信息
        },
        complete: function(res) {}
      })
    })
  }
}