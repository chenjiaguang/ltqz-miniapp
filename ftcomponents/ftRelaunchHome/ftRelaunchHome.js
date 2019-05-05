// components/ftReLaunchHome/ftReLaunchHome.js
Component({
  userStore: true,
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    pageName: ''
  },

  attached: function () {
    const pages = getCurrentPages()
    const page = pages[pages.length -1]
    const pageName = page.name
    this.setData({
      pageName
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    relaunchHome: function () {
      wx.reLaunch({
        url: '/pages/index/index',
        success: () => {
          let _obj = {}
          _obj['showRelaunchHome.' + this.data.pageName] = false
          const app = getApp()
          app.store.setState(_obj)
        }
      })
    }
  }
})
