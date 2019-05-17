// pages/usuallycontacts/usuallycontacts.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderRange: [{
        title: '男',
        value: '1'
      },
      {
        title: '女',
        value: '2'
      }
    ],
    gender_text: {
      1: '男',
      2: '女'
    },
    contacts: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    util.request('/traveler/list').then(res => {
      res.data.forEach((item) => {
        item.editType = '0' //0无操作 1新建 2编辑
      })
      this.setData({
        contacts: res.data
      })
    }).catch(err => {})

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
  nameInput: function(e) {
    let _obj = {}
    _obj['contacts[' + e.currentTarget.dataset.idx + '].name'] = e.detail.value
    this.setData(_obj)
  },

  idCardFocus: function(e) {
    let contact = this.data.contacts[e.currentTarget.dataset.idx]
    let _obj = {}
    _obj['contacts[' + e.currentTarget.dataset.idx + '].id_number_back'] = contact.id_number
    _obj['contacts[' + e.currentTarget.dataset.idx + '].id_number'] = ''
    this.setData(_obj)
  },

  idCardInput: function(e) {
    let _obj = {}
    _obj['contacts[' + e.currentTarget.dataset.idx + '].id_number'] = e.detail.value
    this.setData(_obj)
  },

  genderChange: function(e) {
    let _obj = {}
    _obj['contacts[' + e.currentTarget.dataset.idx + '].sex'] = this.data.genderRange[parseInt(e.detail.value)].value
    this.setData(_obj)
  },
  addItem: function() {
    this.setData({
      contacts: this.data.contacts.concat({
        id: '',
        name: '',
        sex: '',
        id_number: '',
        editType: '1'
      })
    })
  },
  editItem: function(e) {
    this.setData({
      ['contacts[' + e.currentTarget.dataset.idx + '].editType']: '2'
    })
  },
  cancelItem: function(e) {
    let contact = this.data.contacts[e.currentTarget.dataset.idx]
    if (contact.id_number_back) {
      contact.id_number = contact.id_number_back
    }
    this.setData({
      ['contacts[' + e.currentTarget.dataset.idx + '].id_number']: contact.id_number,
      ['contacts[' + e.currentTarget.dataset.idx + '].editType']: '0'
    })
  },
  deleteItem: function(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除此联系人吗？',
      success: (res) => {
        if (res.confirm) {
          let contact = this.data.contacts[e.currentTarget.dataset.idx]
          if (contact.id) {
            util.request('/traveler/edit', {
              id: contact.id,
              status: 0
            }).then(res => {
              this.data.contacts.splice(e.currentTarget.dataset.idx, 1)
              this.setData({
                contacts: this.data.contacts
              })
            }).catch(err => {})
          } else {
            this.data.contacts.splice(e.currentTarget.dataset.idx, 1)
            this.setData({
              contacts: this.data.contacts
            })
          }
        }
      }
    })
  },
  saveItem: function(e) {
    let contact = this.data.contacts[e.currentTarget.dataset.idx]
    util.request('/traveler/edit', {
      id: contact.id,
      name: contact.name,
      sex: contact.sex,
      id_number: contact.id_number
    }).then(res => {
      this.setData({
        ['contacts[' + e.currentTarget.dataset.idx + '].editType']: '0'
      })
    }).catch(err => {})
  },
})