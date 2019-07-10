// components/merchantCard/merchantCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // merchant.nature: 1自营|2第三方
    merchant: {
      type: Object,
      value: {}
    },
    topBorder: {
      type: Boolean,
      value: true
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
    boxTap: function () {
      const { id } = this.data.merchant
      this.triggerEvent('merchanttap', { id })
    }
  }
})
