// components/groupPurchase/groupPurchase.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groupList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        this.countDown(newVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    remainTimeText: {},
    remainTime: {},
    alltimeout: false
  },

  lifetimes: {
    detached: function () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  },

  detached: function () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  timer: null,
  remainSeconds: [],

  /**
   * 组件的方法列表
   */
  methods: {
    countDown: function (list) {
      if (!list) {
        return false
      }
      this.remainSeconds = list.map(item => {
        return {id: item.id, remain: item.remain}
      })
      const func = () => {
        this.remainSeconds.forEach(item => {
          item.remain -= 1
        })
        const remainTime = {}
        const remainTimeText = {}
        this.remainSeconds.forEach(item => {
          const remainClock = this.secondToClock(item.remain)
          remainTime[item.id] = item.remain
          remainTimeText[item.id] = '剩余' + remainClock + '结束'
        })
        const timeout = this.remainSeconds.filter(item => item.remain <= 0)
        this.setData({
          remainTimeText,
          remainTime
        })
        if (timeout.length === this.remainSeconds.length && this.timer) { // 全部剩余时间都为0，清除定时器
          clearInterval(this.timer)
          this.setData({
            alltimeout: true
          })
        }
      }
      func()
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(func, 1000)
    },
    secondToClock: function (seconds) {
      if (seconds <= 0) {
        return '00:00:00'
      }
      let hour = seconds / 3600
      let min = (seconds % 3600) / 60
      let second = seconds % 60
      hour = (hour >= 10) ? parseInt(hour) : ('0' + parseInt(hour))
      min = (min >= 10) ? parseInt(min) : ('0' + parseInt(min))
      second = (second >= 10) ? second : ('0' + second)
      return [hour, min, second].join(':')
    },
    ruleTap: function () {
      console.log('ruleTap')
      wx.navigateTo({
        url: '/pages/statement/statement?type=3'
      })
      
    },
    groupTap: function (e) {
      const {ele} = e.currentTarget.dataset
      const { remainTime} = this.data
      if (remainTime[ele.id] <= 0) { // 超时
        return false
      }
      this.triggerEvent('pintuan', { tuanId: ele.id})
    }
  }
})
