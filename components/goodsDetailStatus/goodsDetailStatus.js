// components/goodsDetailStatus/goodsDetailStatus.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsStatusData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusText: {
      0: '活动未上架',
      1: '活动报名中',
      2: '活动报名中',
      3: '报名已结束',
      4: '报名已结束',
      5: '活动已结束'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
