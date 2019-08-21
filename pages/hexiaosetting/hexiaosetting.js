// pages/hexiaosetting/hexiaosetting.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '核销码设置',
    id: '',
    maxLength: 4,
    focus: false,
    codeArr: [],
    cursor: 0,
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initCodeBox()
    this.setData({
      id: options.id
    })
    const pages = getCurrentPages()
    const prePage = pages[pages.length - 2]
    if (prePage && prePage.provideCode) {
      const code = prePage.provideCode()
      if (code) {
        this.setData({
          code: code.toString()
        })
      }
    }
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
  // onShareAppMessage: function() {

  // },
  initCodeBox: function () {
    const { maxLength} = this.data
    let arr = []
    for (let i = 0; i < maxLength; i++) {
      arr.push(i)
    }
    this.setData({
      codeArr: arr
    })
  },
  codeInput: function (e) {
    let { value, cursor } = e.detail
    this.setData({
      cursor: cursor,
      code: value
    })
  },
  onFocus: function (e) {
    let { focus} = this.data
    console.log('onFocus', focus)
    if (focus) return false
    this.setData({
      focus: true
    })
  },
  onBlur: function (e) {
    this.setData({
      focus: false
    })
  },
  submit() {
    util.request('/admin/hx/change_code', {
      id: this.data.id,
      hx_code: this.data.code
    }).then(res => {
      util.backAndToast('核销密码修改成功啦')
    }).catch(err => {
      console.log('err', err)
    })
  }
})