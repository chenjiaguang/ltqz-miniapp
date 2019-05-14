// pages/editcontact/editcontact.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    requireIdcard: false,
    genderPickerRange: [
      {label: '男', value: '1'},
      {label: '女', value: '2'}
    ],
    genderSelected: null,
    name: '',
    idcard: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {requireidcard, id} = options
    let _obj = {}
    _obj.requireIdcard = !!requireidcard
    _obj.id = id || ''
    console.log(_obj, options)
    this.setData(_obj)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  infoInput: function (e) {
    let {value} = e.detail
    let {ele} = e.currentTarget.dataset
    let _obj = {}
    _obj[ele] = value
    this.setData(_obj)
  },

  genderChange: function (e) {
    console.log('genderChange', e)
    let {value} = e.detail
    this.setData({
      genderSelected: value
    })
  },

  saveContact: function () {
    const { requireIdcard, name, genderSelected, idcard, submitting} = this.data
    if ((requireIdcard && !idcard) || !name || (genderSelected === null) || submitting) {
      return false
    }
    // 调用保存用户信息接口
    // 模仿
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 2000)
  }
})