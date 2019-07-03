// ftcomponents/ftCustomNav/ftCustomNav.js
const app = getApp()
const navInfo = app.globalData.customNav
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '范团亲子'
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
    },
    hideDist: {
      type: String,
      value: 0,
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        let val = newVal
        let dist = 0
        const systemInfo = wx.getSystemInfoSync()
        const rpx = systemInfo.windowWidth / 750
        if (val.indexOf('rpx') !== -1) { // 传入的是rpx
          dist = parseInt(val) * rpx
        } else if (val.indexOf('%') !== -1) {
          dist = systemInfo.windowHeight * (parseFloat(val) / 100)
        } else {
          dist = parseInt(val)
        }
        this.initObserver(dist)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showNav: true,
    showBack: false,
    showHome: false,
    useable: navInfo.useable,
    statusBarHeight: navInfo.statusBarHeight,
    navBoxHeight: navInfo.navBoxHeight,
    useableWidth: navInfo.useableWidth,
    navHeight: navInfo.navHeight,
    color: '#333333',
    bg: '#ffffff'
  },

  attached: function () {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      this.setData({
        showBack: true,
        showHome: false
      })
    } else if (pages.length == 1 && pages[0].name !== 'index' && pages[0].name !== 'mine') { // 页面栈只有一层，且非首页、非我的
      this.setData({
        showBack: false,
        showHome: true
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initObserver(dist) {
      if (dist) {
        let top = dist - navInfo.navHeight
        this.observer = this.createIntersectionObserver()
        this.observer.relativeToViewport({top: top}).observe(".intersection-dot", (res) => {
          const showNav = res.intersectionRatio <= 0
          this.setData({
            showNav
          })
        })
      } else {
        this.clearObserver()()
      }
    },
    clearObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },
    goBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    goHome: function () {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  ready () {
    let val = this.data.hideDist
    let dist = 0
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    if (val.indexOf('rpx') !== -1) { // 传入的是rpx
      dist = parseInt(val) * rpx
    } else if (val.indexOf('%') !== -1) {
      dist = systemInfo.windowHeight * (parseFloat(val) / 100)
    } else {
      dist = parseInt(val)
    }
    this.initObserver(dist)
  },
  detached() {
    this.clearObserver()
  },
})
