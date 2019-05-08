// ftcomponents/ftTheme/ftTheme.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    themes: {
      type: Array,
      value: []
    },
    paddingLeft: {
      type: String,
      value: '32rpx'
    },
    paddingRight: {
      type: String,
      value: '32rpx'
    },
    paddingTop: {
      type: String,
      value: '24rpx'
    },
    paddingBottom: {
      type: String,
      value: '24rpx'
    },
    spacing: {
      type: String,
      value: '15rpx'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    themeTap: function (e) {
      console.log('themeTap', e)
      const {theme} = e.currentTarget.dataset
      this.triggerEvent('themetap', { theme})
    }
  }
})
