// components/goodsDetailStatus/goodsDetailStatus.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsStatusData: {
      type: Object,
      value: {},
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
    
    statusText: {
      0: '活动未上架',
      1: '活动报名中',
      2: '活动报名中',
      3: '报名已结束',
      4: '报名已结束',
      5: '活动已结束'
    },
    remainTimeText: '',
    remainTime: 0,
    timeout: false
  },

  timer: null,
  remainSeconds: 0,

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

  /**
   * 组件的方法列表
   */
  methods: {
    countDown: function (data) {
      if (!data || !data.remain_qg) {
        return false
      }
      this.remainSeconds = data.remain_qg
      const func = () => {
        this.remainSeconds -= 1
        const remainTime = this.remainSeconds
        const remainTimeText = this.secondToClock(remainTime)
        const timeout = this.remainSeconds <= 0
        this.setData({
          remainTimeText,
          remainTime,
          timeout
        })
        if (timeout) { // 全部剩余时间都为0，清除定时器
          this.triggerEvent('timeout')
          if (this.timer) {
            clearInterval(this.timer)
          }
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
      let day = seconds / (3600 * 24)
      let hour = (seconds % (3600 * 24)) / 3600
      let min = (seconds % 3600) / 60
      let second = seconds % 60
      day = parseInt(day)
      hour = (hour >= 10) ? parseInt(hour) : ('0' + parseInt(hour))
      min = (min >= 10) ? parseInt(min) : ('0' + parseInt(min))
      second = (second >= 10) ? second : ('0' + second)
      let arr = []
      if (day > 0) {
        arr.push(day + '天')
      }
      arr = arr.concat([hour, min, second].join(':'))
      return arr.join('')
    }
  }
})
