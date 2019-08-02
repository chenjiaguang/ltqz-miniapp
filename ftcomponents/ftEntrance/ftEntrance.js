// components/ftEntrance/ftEntrance.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    height: {
      type: String,
      value: '78rpx'
    },
    required: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    loading: { // 正在请求数据
      type: Boolean,
      value: false
    },
    image: {
      type: String,
      value: ''
    },
    imageSize: {
      type: Number,
      value: 44
    },
    imageSpacing: {
      type: Number,
      value: 32
    },
    subImage: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    titleStyle: {
      type: String,
      value: ''
    },
    subTitle: {
      type: String,
      value: ''
    },
    extraData: {
      type: Object,
      value: null
    },
    topBorder: {
      type: Boolean,
      value: false
    },
    bottomBorder: {
      type: Boolean,
      value: false
    },
    subMask: {
      type: Boolean,
      value: false
    },
    nextIcon: {
      type: Boolean,
      value: true
    },
    spacing: {
      type: String,
      value: '0 32rpx'
    },
    borderMargin: {
      type: String,
      value: '0'
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
    boxTap: function (e) {
      if (this.data.disabled || this.data.loading) {
        return false
      }
      this.triggerEvent('tap', this.data.extraData)
    }
  }
})

