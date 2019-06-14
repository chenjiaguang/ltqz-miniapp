// pages/collection/collection.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    isCheckAll: false,
    list: [],
    page: null,
    loading: false,
    showDelBtn: false
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
    this.fetchData(1)
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.fetchData(parseInt(this.data.page.pn) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getCheckedIdList: function() {
    let ids = []
    for (let i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i].checked) {
        ids.push(this.data.list[i].id)
      }
    }
    return ids;
  },
  clickCheckAll: function(e) {
    let obj = {
      'isCheckAll': !this.data.isCheckAll
    }
    for (let i = 0; i < this.data.list.length; i++) {
      obj[`list[${i}].checked`] = !this.data.isCheckAll
    }
    obj['showDelBtn'] = !this.data.isCheckAll
    this.setData(obj)
  },
  clickCheck: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      [`list[${index}].checked`]: !this.data.list[index].checked
    }, () => {
      let isCheckAll = true
      for (let i = 0; i < this.data.list.length; i++) {
        if (!this.data.list[i].checked) {
          isCheckAll = false
          break;
        }
      }
      this.setData({
        isCheckAll: isCheckAll,
        showDelBtn: this.getCheckedIdList().length > 0
      })
    })
  },
  toStatus: function(e, value) {
    let obj = {
      'showDelBtn': false,
      'isCheckAll': false,
      'status': e ? e.currentTarget.dataset.status : value
    }
    for (let i = 0; i < this.data.list.length; i++) {
      obj[`list[${i}].checked`] = false
    }
    this.setData(obj)
  },
  onPageScroll: function(e) {
    const {
      top_fixed
    } = this.data
    if (e.scrollTop <= 0 && top_fixed) {
      this.setData({
        top_fixed: false
      })
    } else if (e.scrollTop > 0 && !top_fixed) {
      this.setData({
        top_fixed: true
      })
    }
  },
  deleteItem: function(e) {
    let ids = []
    if (e.currentTarget.dataset.id) {
      ids = [e.currentTarget.dataset.id]
    } else {
      ids = this.getCheckedIdList()
    }

    util.request('/collect/delete', {
      ids: ids
    }).then(res => {
      this.setData({
        page: null,
        list: []
      })
      this.toStatus(null, 0)
      this.fetchData(1)
    }).catch(err => {
      console.log('err', err)
    })
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?id=' + id
    })
  },
  fetchData: function(pn = 1) {
    this.setData({
      loading: true
    })
    util.request('/collect/list', {
      pn: pn
    }).then(res => {
      if (res.error == 0 && res.data) {
        res.data.list.forEach(item => {
          if (item.data) {
            item.data.min_price = util.formatMoney(item.data.min_price).showMoney
            item.data.min_origin_price = util.formatMoney(item.data.min_origin_price).showMoney
            item.data.min_pt_price = util.formatMoney(item.data.min_pt_price).showMoney
          }
        })
        if (pn == 1) {
          this.setData({
            list: res.data.list,
            page: res.data.page,
            loading: false
          })
        } else {
          let list = this.data.list
          list = list.concat(res.data.list)
          this.setData({
            list: list,
            page: res.data.page,
            loading: false
          })
        }
      }
    }).catch(err => {
      console.log('err', err)
    })
  }
})