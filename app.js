const config = require('/configs/index.js');
import authManager from '/utils/authManager.js'
import storageHelper from '/utils/storageHelper.js'
import bindFenxiao from '/utils/bindFenxiao.js'
import expand from '/utils/expand.js'
import util from '/utils/util.js'
let store = require('/store/index.js')

App({
  globalData: {
    env: config.env,
    userInfo: null,
    themeColor: '#FF2266', // 设置主题色
    themeModalConfirmColor: '#F24724'
  },
  config: config,
  store,
  onLaunch: function(options) {
    
  },
  onShow: function(options) { // 监听用户授权信息是否有变动
    const {path, query} = options
    let fenxiaoid = ''
    if ((path.indexOf('/goodsdetail/goodsdetail') !== -1 || path.indexOf('/pintuandetail/pintuandetail') !== -1) && (query.uid || query.scene)) {
      if (query.uid) {
        fenxiaoid = query.uid.toString()
      } else if (query.scene) {
        const scene = decodeURIComponent(query.scene)
        let paramsArr = scene.split('&')
        let paramsObj = {}
        paramsArr.forEach(item => {
          let obj = item.split('=')
          paramsObj[obj[0]] = obj[1]
        })
        fenxiaoid = paramsObj.uid ? paramsObj.uid.toString() : ''
      }
    }
    if (fenxiaoid) {
      bindFenxiao.saveFenxiaoId(fenxiaoid)
    }
  }
})