// pages/permission/permission.js
import authManager from '../../utils/authManager.js'
import storageHelper from '../../utils/storageHelper.js'
import util from '../../utils/util.js'

Page({
  name: 'permission',
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '范团精选',
    showType: '', // type：['permission','update_token']
    swiperCurrent: 0,
    disableAuth: true,
    authUserInfo: false,
    openType: 'getUserInfo',
    phoneNumber: '',
    temToken: '',
    loging: false,
    phoneBinding: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    storageHelper.setStorage('permissionTimeStamp', new Date().getTime())
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

  goBack: function () {
    this.navigateBack()
  },

  login() {
    wx.login({
      success: res => { // login调用成功后授权按钮才可用
        this.setData({
          disableAuth: false
        })
        this.code = res.code
      }
    })
  },

  startRelaunch: function () {
    const pages = getCurrentPages()
    if (pages.length > 1) { // 该授权页面不是第一个页面时
      const page = pages[pages.length - 2]
      if (page && page.route && page.options) {
        const url = ('/' + util.getUrl(page.route, page.options)) || '/pages/index/index'
        this.reLaunch({
          url: url
        })
      }
    } else {
      this.reLaunch({
        url: '/pages/mine/mine'
      })
    }
  },

  getPhoneNumber: function (e) {
    console.log('getPhoneNumber', e)
    const {phoneBinding} = this.data
    const { iv, encryptedData } = e.detail
    const temToken = storageHelper.getStorage('temToken')
    if (!temToken) {
      this.code = ''
      this.setData({
        swiperCurrent: 0,
        showType: 'permission',
        disableAuth: true,
        authUserInfo: false,
        openType: 'getUserInfo'
      }, () => {
        this.login()
      })
      return false
    }
    if (phoneBinding) {
      return false
    }
    if (iv && encryptedData) {
      this.setData({
        phoneBinding: true
      })
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
          storageHelper.setStorage('uphone', phone || '')
          storageHelper.setStorage('temToken', '')
          storageHelper.setStorage('token', temToken)
          this.startRelaunch()
        } else {
          this.code = ''
          this.setData({
            swiperCurrent: 0,
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
          swiperCurrent: 0,
          showType: 'permission',
          disableAuth: true,
          authUserInfo: false,
          openType: 'getUserInfo'
        }, () => {
          this.login()
        })
      }).finally(res => {
        this.setData({
          phoneBinding: false
        })
      })
    }
  },

  getUserInfo: function(e) {
    console.log('getUserInfo', e)
    if (e.detail.errMsg === 'getUserInfo:ok') {
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
      if (this.data.loging) {
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
    const {loging} = this.data
    if (!logingInfo || loging) { // 参数不存在 或 判断是否正在调用登录接口，避免重复调用登录接口后提示code已使用的问题
      return false
    }
    let rData = Object.assign({}, {
      code: this.code
    }, logingInfo)
    this.setData({
      loging: true
    })
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
        if (phone) { // 有手机号
          storageHelper.setStorage('temToken', '')
          storageHelper.setStorage('token', token)
          this.setData({
            authUserInfo: true,
            openType: 'getPhoneNumber'
          })
          this.startRelaunch()
        } else { // 没手机号
          storageHelper.setStorage('temToken', token)
          this.setData({
            swiperCurrent: 1,
            temToken: token,
            authUserInfo: true,
            openType: 'getPhoneNumber'
          })
        }
      } else {
        this.setData({
          swiperCurrent: 0,
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
          swiperCurrent: 0,
          authUserInfo: false,
          showType: 'permission',
          openType: 'getUserInfo'
        })
      }
    }).finally(res => {
      this.code = ''
      this.setData({
        loging: false
      })
    })
  }

})