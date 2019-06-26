// components/collectBtn/collectBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: Number,
      value: 36
    },
    collected: {
      type: Boolean,
      observer: function (newVal, oldVal) {
        if (this.taped) {
          this.collectedChange(newVal)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  taped: false,
  iconAnimation: null,
  bgAnimation: null,

  /**
   * 组件的方法列表
   */
  methods: {
    collectedChange: function (collected) {
      console.log('collectedChange', collected)
      let _obj = {}
      if (this.taped) {
        if (!this.bgAnimation) {
          this.bgAnimation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-out'
          })
        }
        if (!this.iconAnimation) {
          this.iconAnimation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-out'
          })
        }
        if (collected) {
          this.bgAnimation.opacity(0.5).scale(0.33, 0.33).step({ duration: 1 }).opacity(1).scale(1, 1).step({ duration: 298 }).scale(1, 1).step({ duration: 50 }).opacity(0).scale(0.33, 0.33).step({ duration: 1 })
          _obj.bgAnimationData = this.bgAnimation.export()
        }
        this.iconAnimation.scale(0.7, 0.7).step({ duration: 50 }).scale(1.1, 1.1).step({ duration: 200 }).scale(1, 1).step({ duration: 50 })
        _obj.iconAnimationData = this.iconAnimation.export()
      }
      wx.vibrateShort()
      this.setData(_obj)
    },
    collectionTap: function () {
      this.taped = true
      const { collected} = this.data
      this.triggerEvent('collecttap', { collected })
    }
  }
})
