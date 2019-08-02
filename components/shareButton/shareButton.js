// components/shareButton/shareButton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    profit: {
      type: String,
      value: 0
    },
    showPrice: {
      type: Boolean,
      value: false
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
    btnTap: function () {
      this.triggerEvent('share')
    }
  }
})
