// components/activityCard/activityCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activity: {
      type: Object,
      value: {}
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
      const {id} = this.data.activity
      this.triggerEvent('activitytap', { id })
    }
  }
})
