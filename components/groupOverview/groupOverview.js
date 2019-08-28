// components/groupOverview/groupOverview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    group: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        if (newVal.status == 1 && newVal.expired_timestamp > 0) { // 拼团中
          this.countDown(newVal)
        }
        this.getUsers(newVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusText: {
      0: '人数不足，拼团超时关闭',
      1: '拼团中',
      2: '拼团成功'
    },
    remainTime: 0,
    remainTimeText: '',
    users: [],
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
    getUsers: function (tuan) {
      const len = tuan.spell_num
      let users = []
      users = users.concat(tuan.tuanRecord)
      const length = len - users.length
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          users.push({id: new Date().getTime() + i, avatar: ''})
        }
      }
      this.setData({
        users: users
      })
    },
    countDown: function (tuan) {
      if (!tuan || !tuan.expired_timestamp) {
        return false
      }
      this.remainSeconds = tuan.expired_timestamp
      const func = () => {
        const needUsers = tuan.spell_num - tuan.tuanRecord.length
        this.remainSeconds -= 1
        const remainTime = this.remainSeconds
        const remainClock = this.secondToClock(remainTime)
        const remainTimeText = '还差' + needUsers + '人成团，剩余' + remainClock
        const timeout = remainTime <= 0
        this.setData({
          remainTimeText,
          remainTime,
          timeout
        })
        if (timeout && this.timer) {
          clearInterval(this.timer)
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
    goPintuanDetail: function () {
      const { id } = this.data.group
      this.navigateTo({
        url: '/pages/pintuandetail/pintuandetail?id=' + id
      })
    },
    shareTap: function (e) {
      const { id, product_id } = this.data.group
      this.triggerEvent('share', {
        product_id: product_id,
        pt_id: id
      })
    }
  }
})
