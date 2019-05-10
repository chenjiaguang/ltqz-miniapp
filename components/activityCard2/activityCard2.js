// components/activityCard2/activityCard2.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activity: {
      type: Object,
      value: {}
    },
    topBorder: {
      type: Boolean,
      value: false
    },
    bottomBorder: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activityStatusText: {
      0: '已失效',
      1: '报名中',
      2: '已满额',
      3: '已截止',
      4: '已满额',
      5: '已结束'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    boxTap: function () {
      const { id } = this.data.activity
      this.triggerEvent('activitytap', { id })
    }
  }
})
