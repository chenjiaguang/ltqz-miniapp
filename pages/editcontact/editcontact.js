// pages/editcontact/editcontact.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '',
    id: '',
    genderPickerRange: [{
        label: '男',
        value: '1'
      },
      {
        label: '女',
        value: '2'
      }
    ],
    gender_text: {
      1: '男',
      2: '女'
    },
    name: '',
    idcard: '',
    sex: '',
    saving: false,
    deleting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      wx.setNavigationBarTitle({
        title: '编辑出行人'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增出行人'
      })
    }
    this.setData({
      id: options.id || '',
      name: options.name || '',
      idcard: options.id_number || '',
      sex: options.sex || '',
      requireidcard: options.requireidcard || false,
      navTitle: options.id ? '编辑出行人' : '新增出行人'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  onUnload: function() {},

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
  // onShareAppMessage: function() {

  // },

  infoInput: function(e) {
    let {
      value
    } = e.detail
    let {
      ele
    } = e.currentTarget.dataset
    let _obj = {}
    _obj[ele] = value
    this.setData(_obj)
  },

  genderChange: function(e) {
    let {
      value
    } = e.detail
    this.setData({
      sex: this.data.genderPickerRange[parseInt(e.detail.value)].value
    })
  },

  saveContact: function() {
    const {
      id,
      name,
      genderPickerRange,
      idcard,
      sex,
      requireidcard,
      saving
    } = this.data
    if ((!idcard && requireidcard) || !name || !sex || saving) {
      return false
    }
    let rData = {
      id,
      name,
      sex,
      id_number: idcard,
      status: 1
    }
    this.setData({
      saving: true
    })
    util.request('/traveler/edit', rData).then(res => {
      if (res.error == 0 && res.data) {
        const pages = getCurrentPages()
        const page = pages[pages.length - 2]
        if (page && page.name == 'ordersubmit' && page.editBack) { // 更新提交订单页面的常用联系人信息
          page.editBack(res.data)
        }
        util.backAndToast(res.msg || '保存成功')
      } else {
        if (res.msg) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    }).catch(err => {}).finally(res => {
      this.setData({
        saving: false
      })
    })
  },
  delContact: function() {
    if (!this.data.deleting) {
      const app = getApp()
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      wx.showModal({
        content: '确定要删除此出行人吗？',
        confirmColor,
        success: res => {
          if (res.confirm) {
            this.setData({
              deleting: true
            })
            util.request('/traveler/edit', {
              id: this.data.id,
              status: 0
            }).then(res => {
              const pages = getCurrentPages()
              const page = pages[pages.length - 2]
              if (page && page.name == 'ordersubmit' && page.fetchBuyfors) { // 更新提交订单页面的常用联系人信息
                page.fetchBuyfors()
              }
              util.backAndToast(res.msg || '删除成功')
            }).catch(err => {
              console.log('err', err)
            }).finally(res => {
              this.setData({
                deleting: false
              })
            })
          } else if (res.cancel) {}
        },
        fail: res => {}
      })
    }
  }
})