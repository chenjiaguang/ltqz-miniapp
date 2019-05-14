// pages/usuallycontacts/usuallycontacts.js
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
    contacts: [{
      name: '张三',
      gender: '1',
      idcard: '460026478390987878'
    }]
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

  idCardInput: function(e) {
    let _obj = {}
    _obj['contacts[' + e.currentTarget.dataset.idx + '].idcard'] = e.detail.value
    this.setData(_obj)
  },

  genderChange: function(e) {
    console.log('genderChange', e)
    let {
      value
    } = e.detail
    value = parseInt(value)
    const {
      type,
      idx
    } = e.currentTarget.dataset
    let contacts = ''
    if (type === '1') {
      contacts = 'contacts'
    } else if (type === '2') {
      contacts = 'new_contacts'
    }
    let _obj = {}
    _obj[contacts + '[' + idx + '].gender'] = this.data.genderRange[value].value
    console.log('_obj', _obj)
    this.setData(_obj)
  },
  add: function() {
    this.setData({
      contacts: this.data.contacts.concat({
        name: '',
        gender: '',
        idcard: ''
      })
    })
  },

  deleteTap: function(e) {
    this.data.contacts.splice(e.currentTarget.dataset.idx, 1)
    this.setData({
      contacts: this.data.contacts
    })
  }
})