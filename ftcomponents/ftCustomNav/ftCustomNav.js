// ftcomponents/ftCustomNav/ftCustomNav.js
const app = getApp()
const statusBarHeight = app.globalData.statusBarHeight
const canuse = app.globalData.pageNavigationCustomable
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    fixed: {
      type: Boolean,
      value: false
    },
    color: {
      type: String,
      value: '#000000'
    },
    bg: {
      type: String,
      value: '#FFFFFF'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBack: false,
    canuse: canuse,
    fixed: false,
    statusBarHeight: statusBarHeight,
    color: '#333333',
    bg: '#ffffff'
  },

  attached: function () {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      this.setData({
        showBack: true
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBack: function () {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
