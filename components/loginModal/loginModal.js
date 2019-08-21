// components/loginModal/loginModal.js
import storageHelper from '../../utils/storageHelper.js'
import util from '../../utils/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showType: '', // type：['permission','update_token']
    disableAuth: true,
    authUserInfo: false,
    openType: 'getUserInfo',
    phoneNumber: '',
    temToken: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      const app = getApp()
      app.globalData.loging = true
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.show && ftModal.show()
      const token = storageHelper.getStorage('token')
      if (token) {
        this.setData({
          showType: 'update_token'
        })
        this.updateToken()
      } else {
        this.setData({
          showType: 'permission'
        })
        this.setData({
          disableAuth: true,
          authUserInfo: false,
          openType: 'getUserInfo'
        }, () => {
          this.login()
        })
      }
    },

    hide: function () {
      const app = getApp()
      app.globalData.loging = false
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.hide && ftModal.hide()
    },

    updateToken: function() {
      console.log('updateToken')
      wx.login({
        success: res => { // login调用成功后授权按钮才可用
          this.getToken({
            code: res.code
          })
        }
      })
    },
  
    login() {
      wx.login({
        success: res => { // login调用成功后授权按钮才可用
          console.log('login', res)
          this.setData({
            disableAuth: false
          })
          this.code = res.code
        }
      })
    },

    relaunch: function () {
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      const url = ('/' + util.getUrl(page.route, page.options)) || '/pages/index/index'
      wx.reLaunch({
        url: url
      })
    },

    getPhoneNumber: function (e) {
      console.log('getPhoneNumber', e)
      const { iv, encryptedData } = e.detail
      const temToken = storageHelper.getStorage('temToken')
      if (!temToken) {
        this.code = ''
        this.setData({
          showType: 'permission',
          disableAuth: true,
          authUserInfo: false,
          openType: 'getUserInfo'
        }, () => {
          this.login()
        })
        return false
      }
      if (iv && encryptedData) {
        util.request('/common/decrypt', {
          iv: iv,
          encryptedData: encryptedData
        }, {
          token: temToken
        }).then(res => {
          if (res.error == 0 && res.data && res.data.phoneNumber) {
            const phone = res.data.phoneNumber
            this.setData({
              phoneNumber: phone
            })
            this.hide()
            storageHelper.setStorage('uphone', phone || '')
            storageHelper.setStorage('temToken', '')
            storageHelper.setStorage('token', temToken)
            this.relaunch()
          } else {
            this.code = ''
            this.setData({
              showType: 'permission',
              disableAuth: true,
              authUserInfo: false,
              openType: 'getUserInfo'
            }, () => {
              this.login()
            })
          }
        }).catch(err => {
          this.code = ''
          this.setData({
            showType: 'permission',
            disableAuth: true,
            authUserInfo: false,
            openType: 'getUserInfo'
          }, () => {
            this.login()
          })
        })
      }
    },
  
    getUserInfo: function(e) {
      console.log('getUserInfo', e)
      if (e.detail.errMsg === 'getUserInfo:ok') {
        this.setData({
          authUserInfo: true,
          openType: 'getPhoneNumber'
        })
        const {
          encryptedData,
          iv,
          rawData,
          signature
        } = e.detail
        const {
          avatarUrl,
          gender,
          nickName
        } = e.detail.userInfo
        const logingInfo = {
          encryptedData,
          iv,
          rawData,
          signature,
          avatarUrl,
          gender,
          nickName
        }
        if (this.loging) {
          return false
        }
        this.getToken(logingInfo)
      } else {
        this.setData({
          authUserInfo: false,
          openType: 'getUserInfo'
        })
      }
    },

    getToken: function (logingInfo) {
      if (!logingInfo || this.loging) { // 参数不存在 或 判断是否正在调用登录接口，避免重复调用登录接口后提示code已使用的问题
        return false
      }
      let rData = Object.assign({}, {
        code: this.code
      }, logingInfo)
      this.loging = true
      util.request('/login', rData).then(res => {
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
          this.setData({
            temToken: token,
            authUserInfo: true,
            openType: 'getPhoneNumber'
          })
          if (phone) { // 有手机号
            this.hide()
            storageHelper.setStorage('temToken', '')
            storageHelper.setStorage('token', token)
            this.setData({
              temToken: '',
              phoneNumber: phone
            })
            this.relaunch()
          } else { // 没手机号
            storageHelper.setStorage('temToken', token)
            this.setData({
              temToken: token,
              authUserInfo: true,
              openType: 'getPhoneNumber'
            })
          }
        } else {
          this.setData({
            authUserInfo: false,
            openType: 'getUserInfo'
          }, () => {
            this.login()
          })
        }
      }).catch(err => {
        if (err.error == 1 && this.data.showType === 'update_token') {
          this.login()
          this.setData({
            showType: 'permission'
          })
        }
      }).finally(res => {
        this.code = ''
        this.loging = false
      })
    }
  }
})
