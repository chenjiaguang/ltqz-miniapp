// components/activityCard3/activityCard3.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activity: {
      type: Object,
      value: {}
    },
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
    goSignUpManager(e) {
      wx.navigateTo({
        url: `/pages/signupmanager/signupmanager?id=${e.currentTarget.dataset.shopid}&hd_id=${e.currentTarget.dataset.hdid}`
      })
    }
  }
})