// ftcomponents/ftCustomNav/ftCustomNav.js
const app = getApp()
const navInfo = app.globalData.customNav
console.log('navInfo', navInfo)
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '范团精选'
    },
    fixed: {
      type: Boolean,
      value: false
    },
    color: { // 仅支持 #000000 和 #ffffff
      type: String,
      value: '#000000',
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        if (newVal === '#ffffff') {
          wx.setNavigationBarColor({
            frontColor: newVal,
            backgroundColor	: this.data.bg || '#ffffff'
          })
        } else if (newVal === '#000000') {
          wx.setNavigationBarColor({
            frontColor: newVal,
            backgroundColor	: this.data.bg || '#ffffff'
          })
        }
      }
    },
    bg: {
      type: String,
      value: '#ffffff'
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
        if (val) {
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    observeDist: 0,
    showHideChanged: false,
    showNav: true,
    showBack: false,
    showHome: false,
    useable: navInfo.useable,
    statusBarHeight: navInfo.statusBarHeight,
    navBoxHeight: navInfo.navBoxHeight,
    menuHeight: navInfo.menuHeight,
    useableWidth: navInfo.useableWidth,
    navHeight: navInfo.navHeight
  },

  attached: function () {
    const pages = getCurrentPages()
    console.log('attached', pages)
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
        this.setData({
          observeDist: top
        })
        this.observer = this.createIntersectionObserver()
        this.observer.relativeToViewport().observe(".intersection-dot", (res) => {
          const showNav = res.intersectionRatio == 0
          this.setData({
            showHideChanged: true,
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
      console.log('goHome')
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  ready () {
    console.log('ready')
    let val = this.data.hideDist
    let dist = 0
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    if (val) {
      if (val.indexOf('rpx') !== -1) { // 传入的是rpx
        dist = parseInt(val) * rpx
      } else if (val.indexOf('%') !== -1) {
        dist = systemInfo.windowHeight * (parseFloat(val) / 100)
      } else {
        dist = parseInt(val)
      }
      this.initObserver(dist)
    }
  },
  detached() {
    this.clearObserver()
  },
})
