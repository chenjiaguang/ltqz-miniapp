// ftcomponents/ftCustomNav/ftCustomNav.js
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
        const val = newVal
        this.calHideDist(val)
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
    observeDist: 0,
    showHideChanged: false,
    showNav: true,
    showBack: false,
    showHome: false
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
    calHideDist: function (distVal) {
      const {rpx, windowHeight} = this.data._nav_data_
      let val = distVal
      let dist = 0
      if (val) {
        if (val.indexOf('rpx') !== -1) { // 传入的是rpx
          dist = parseInt(val) * rpx
        } else if (val.indexOf('%') !== -1) {
          dist = windowHeight * (parseFloat(val) / 100)
        } else {
          dist = parseInt(val)
        }
        this.initObserver(dist)
      }
    },
    initObserver(dist) {
      if (dist) {
        let top = dist - this.data._nav_data_.navHeight
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
      this.navigateBack({
        delta: 1
      })
    },
    goHome: function () {
      this.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  ready () {
    const val = this.data.hideDist
    this.calHideDist(val)
  },
  detached() {
    this.clearObserver()
  },
})
