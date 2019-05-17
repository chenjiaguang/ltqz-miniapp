// pages/editcontact/editcontact.js
import util from '../../utils/util.js'

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
    idcard: '',
    saving: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {requireidcard, id} = options
    let _obj = {}
    _obj.requireIdcard = !!requireidcard
    _obj.id = id || ''
    this.setData(_obj)
    if (id) {
      const pages = getCurrentPages()
      const page = pages[pages.length - 2]
      if (page && page.getBuyforFromData) {
        const data = page.getBuyforFromData(id)
        console.log('data', data)
        if (!data) {
          return false
        }
        let _obj = {}
        _obj.idcard = data.id_number
        _obj.name = data.name
        this.data.genderPickerRange.forEach((item, idx) => {
          if (item.value == data.sex) {
            _obj.genderSelected = idx
          }
        })
        this.setData(_obj)
      }
    }
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
    if (this.backTimer) {
      clearTimeout(this.backTimer)
    }
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
    const { id, requireIdcard, name, genderPickerRange, genderSelected, idcard, submitting} = this.data
    if ((requireIdcard && !idcard) || !name || (genderSelected === null) || submitting) {
      return false
    }
    let rData = {
      id,
      name,
      sex: genderPickerRange[genderSelected].value,
      id_number: idcard,
      status: 1
    }
    this.setData({
      saving: true
    })
    util.request('/traveler/edit', rData).then(res => {
      if (res.error == 0) {
        wx.showToast({
          title: res.msg || '保存成功',
          icon: 'none',
          duration: 1500
        })
        const pages = getCurrentPages()
        const page = pages[pages.length - 2]
        if (page && page.updateBuyfors && res.data.id) {
          page.updateBuyfors(res.data.id)
        }
        this.backTimer = setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    }).catch(err => {

    }).finally(res => {
      this.setData({
        saving: false
      })
    })
  }
})