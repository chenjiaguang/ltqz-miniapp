// components/ftCates/ftCates.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cates: {
      type: Array,
      value: []
    },
    max: {
      type: Number,
      value: 4
    },
    padding: {
      type: String,
      value: '10rpx 30rpx'
    },
    justify: { // 接受space-between、space-around、center、flex-star、flex-end
      type: String,
      value: 'space-between'
    },
    iconWidth: {
      type: String,
      value: '120rpx'
    },
    iconHeight: {
      type: String,
      value: '120rpx'
    },
    textSize: {
      type: String,
      value: '30rpx'
    },
    textColor: {
      type: String,
      value: '#333'
    },
    textLineHeight: {
      type: String,
      value: '50rpx'
    },
    extraData: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached: function () {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cateTap: function (e) {
      let { idx, item } = e.currentTarget.dataset
      this.triggerEvent('tap', Object.assign({}, this.data.extraData, { idx, item }))
    }
  }
})
