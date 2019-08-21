// components/orderDetailBottomButton/orderDetailBottomButton.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btndata: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.setData({collected: newVal.is_collect})
        }
      }
    },
    timestamp: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderContact: null,
    showCollectTip: false,
    collected: false,
    collectting: false
  },

  attached: function () {
    this.getOrderContact()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goLogin: function () {
      util.checkLogin()
    },
    makePhoneCall: function (e) {
      let {phone} = e.currentTarget.dataset
      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone.toString()
        })
      }
    },
    hideCollectTip: function () {
      this.setData({
        showCollectTip: false
      })
    },
    collectTap: function () {
      if (!util.checkLogin()) {
        return false
      }
      const {collected, collectting, btndata: {id}} = this.data
      if (collectting) { // 未获取数据成功 或 正在操作，则点击收藏无效
        return false
      }
      const url = collected ? '/collect/delete' : '/collect/add'
      const rData = collected ? { ids: [id] } : { product_id: id}
      this.setData({
        collectting: true
      })
      wx.vibrateShort()
      util.request(url, rData).then(res => {
        if (res.error == 0) {
          if (!collected) { // 收藏成功
            const goodsCollected = storageHelper.getStorage('goodsCollected')
            if (!goodsCollected) {
              this.setData({
                showCollectTip: true
              })
              setTimeout(() => this.hideCollectTip(), 3000)
            } else {
              wx.showToast({
                title: '收藏成功',
                icon: 'none'
              })
            }
            storageHelper.setStorage('goodsCollected', true)
          } else { // 取消收藏
            wx.showToast({
              title: '取消收藏成功',
              icon: 'none'
            })
          }
          this.setData({
            collected: !collected
          })
        }
      }).catch(err => {
  
      }).finally(res => {
        this.setData({
          collectting: false
        })
      })
    },
    showShoppingView: function (e) {
      this.triggerEvent('next', {saletype: e.currentTarget.dataset.saletype})
    },
    initContact: function (e) {
      const { iv, encryptedData } = e.detail
      if (iv && encryptedData) {
        util.request('/common/decrypt', {
          iv: iv,
          encryptedData: encryptedData,
        }).then(res => {
          if (res.error == 0) {
            const contactJson = storageHelper.getStorage('orderContact')
            let _obj = contactJson ? JSON.parse(contactJson): {}
            _obj['手机'] = res.data.phoneNumber
            storageHelper.setStorage('orderContact', JSON.stringify(_obj))
            this.setData({
              orderContact: _obj
            }, () => {
              console.log('感谢您的授权，继续操作吧')
            })
          }
        }).catch(err => { })
      }
    },
    getOrderContact: function () {
      const contactJson = storageHelper.getStorage('orderContact')
      if (contactJson) {
        this.setData({
          orderContact: JSON.parse(contactJson)
        })
      } else {
        let phone = storageHelper.getStorage('uphone')
        if (phone) {
          let _obj = contactJson ? JSON.parse(contactJson): {}
          _obj['手机'] = phone
          storageHelper.setStorage('orderContact', JSON.stringify(_obj))
          this.setData({
            orderContact: _obj
          })
        } else {
          util.request('/user/detail').then(res => {
            if (res.error == 0 && res.data) { // 获取用户信息成功
              if (res.data.phone) { // 有电话才设置
                storageHelper.setStorage('uphone', res.data.phone)
                let _obj = contactJson ? JSON.parse(contactJson): {}
                _obj['手机'] = res.data.phone
                storageHelper.setStorage('orderContact', JSON.stringify(_obj))
                this.setData({
                  orderContact: _obj
                })
              }
            }
          })
        }
      }
    },
    triggerNext: function (e) {
      this.triggerEvent('next', e.detail)
    }
  }
})
