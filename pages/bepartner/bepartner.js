// pages/bepartner/bepartner.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '申请合伙人',
    user: null,
    condition: [],
    can_apply: false,
    fenxiao_user_status: '', // -1已拉黑|0正在审批|1已通过|2不是分销员(未通过)
    btnText: {
      '-1': '立即申请',
      0: '等候审批...',
      1: '立即申请',
      2: '立即申请'
    },
    loaded: false,
    submitting: false // 是否正在请求申请
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getApplyInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // util.request('/user/detail').then(res => {
    //   this.setData({
    //     user: res.data
    //   })
    // }).catch(err => {
    //   console.log('err', err)
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  apply (e) {
    console.log('e', e)
    this.setData({
      submitting: true
    })
    this.toggleModal()
    util.request('/user/become_fenxiao', {
      phone: this.data.user.phone,
      form_id: e.detail.formId
    }, {dontToast: true}).then(res => {
      if (res.error == 0) {
        // util.backAndToast('您已申请成功，请耐心等待工作人员审核')
        if (res.data && res.data.status == 1) {
          this.resetOtherPageAndBack(res.msg)
        } else {
          this.setData({
            fenxiao_user_status: '0'
          })
          if (res.msg) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
          this.getApplyInfo()
        }
      } else {
        if (res.msg) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    }).catch(err => {
      console.log('err', err)
      if (res.msg) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).finally(res => {
      this.setData({
        submitting: false
      })
    })
  },

  resetOtherPageAndBack: function (msg) {
    const pages = getCurrentPages()
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].name === 'goodsdetail' && pages[i].data.show_fx_banner) { // 活动详情页，隐藏申请成为合伙人入口
        pages[i].setData({show_fx_banner: false})
      }
    }
    if (msg) {
      util.backAndToast(msg)
    }
  },

  getPhoneNumber(e) {
    if (e.detail.encryptedData) {
      util.request('/common/decrypt', {
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
      }).then(res => {
        this.setData({
          ['user.phone']: res.data.phoneNumber
        })
      }).catch(err => {
        console.log('err', err)
      })
    }
  },

  showApplyModal: function () {
    let {loaded, can_apply, fenxiao_user_status, submitting} = this.data
    if (!loaded || submitting || fenxiao_user_status === 0 || fenxiao_user_status === '0') { // 数据未获取完成 或 正在提交数据 或 正在审批
      return false
    }
    if (fenxiao_user_status == -1) {
      const app = getApp()
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      wx.showModal({
        content: '由于您违反了范团精选平台用户协议，已失去申请成为合伙人的资格',
        showCancel: false,
        confirmText: '确定',
        confirmColor
      })
      // wx.showToast({
      //   title: '由于您违反了范团精选平台用户协议，已失去申请成为合伙人的资格',
      //   icon: 'none',
      //   duration: 3000
      // })
      return false
    } else if (fenxiao_user_status == 1) {
      wx.showToast({
        title: '您已经是合伙人了，可以在“我的”页面查看相关信息哦~',
        icon: 'none',
        duration: 3000
      })
      return false
    }
    
    if (fenxiao_user_status != 2) { // fenxiao_user_status: 2表示不是分销员
      return false
    }
    if (!can_apply) {
      wx.showToast({
        title: '您未达到申请条件',
        icon: 'none'
      })
      return false
    }
    this.toggleModal()
  },

  toggleModal: function () {
    const ftModal = this.selectComponent('#c-ft-modal')
    ftModal && ftModal.toggle && ftModal.toggle()
  },

  stopPropagation: function () {
    return false
  },

  getApplyInfo: function () {
    util.request('/fenxiao/apply_info').then(res => {
      if (res.error == 0 && res.data) {
        let _obj = res.data
        _obj.loaded = true
        this.setData(_obj)
      }
    }).catch(err => {
      console.log('err', err)
    })
  }
})