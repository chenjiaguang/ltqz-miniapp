// components/goodsDetailStatus/goodsDetailStatus.js
import statusHelper from '../../utils/statusHelper'

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
        if (newVal) {
          const statusText = statusHelper.getStatusText(newVal.type, newVal.sale_type, newVal.status, newVal.qg_status)
          const priceObj = statusHelper.getPriceText(newVal.type, newVal.sale_type, newVal.status, newVal.qg_status, newVal.show_min_price, newVal.show_min_pt_price, newVal.show_min_qg_price, newVal.price_num)
          let _obj = Object.assign({}, {statusText}, priceObj)
          this.setData(_obj)
        }
        this.countDown(newVal)
      }
    },
    uid: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusText: '',
    priceText: '',
    isFree: false,
    hasMore: false,
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
    },
    shareBtnTap: function () {
      this.triggerEvent('share')
    }
  }
})
