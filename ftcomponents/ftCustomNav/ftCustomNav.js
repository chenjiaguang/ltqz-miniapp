// ftcomponents/ftCustomNav/ftCustomNav.js
const app = getApp()

let systemInfo = app.globalData.systemInfo || wx.getSystemInfoSync()
let MenuButtonInfo = app.globalData.MenuButtonInfo || wx.getMenuButtonBoundingClientRect()

const statusBarHeight = systemInfo.statusBarHeight
const menuTopSpace = MenuButtonInfo.top - statusBarHeight
const menuHeight = MenuButtonInfo.height
const navBoxHeight = menuTopSpace * 2 + menuHeight // 导航胶囊上下分别留6px的间隔
const navUseableWidth = MenuButtonInfo.left - 20
const navWrapperHeight = statusBarHeight + navBoxHeight
const env = app.globalData.env
MenuButtonInfo.radius = Math.ceil(MenuButtonInfo.height / 2)
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
    fixedAdapterBg: {
      type: String,
      value: 'transparent'
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
    },
    tapable: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    env: env,
    observeDist: 0,
    showHideChanged: false,
    showNav: true,
    showBack: false,
    showHome: false,
    statusBarHeight: statusBarHeight,
    navBoxHeight: navBoxHeight,
    menuHeight: menuHeight,
    useableWidth: navUseableWidth,
    navHeight: navWrapperHeight,
    MenuButtonInfo: MenuButtonInfo
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
        let top = dist - this.data.navHeight
        this.setData({
          observeDist: top
        })
        if (this.observer) {
          this.clearObserver()
        }
        this.observer = this.createIntersectionObserver()
        this.observer.relativeToViewport().observe(".intersection-dot", (res) => {
          const showNav = res.intersectionRatio == 0
          this.setData({
            showHideChanged: true,
            showNav
          })
        })
      } else {
        this.clearObserver()
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
