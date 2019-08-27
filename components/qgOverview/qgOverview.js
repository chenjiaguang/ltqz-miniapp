// components/qgOverview/qgOverview.js
import util from '../../utils/util.js'

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
        this.initQgData(newVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    beginTime: '',
    remindRequesting: false,
    qgRemind: false
  },

  remindAble: false,
  timer: null,

  lifetimes: {
    detached: function () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  },

  detached: function () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initQgData: function (data) {
      if (!data || !data.qg_btime) {
        return false
      }
      if (data.start_qg && data.start_qg > 0) {
        const remind_min = 15
        const remind_second = remind_min * 60
        const time = (data.start_qg - remind_second) * 1000
        if (time > 0) {
          this.remindAble = true
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.remindAble = false
          }, time)
        } else {
          this.remindAble = false
        }
      }
      const text = data.qg_btime
      const timeArr = text.split(' ')
      const dateArr = timeArr[0].split('-')
      const clockArr = timeArr[1].split(':')
      const month = parseInt(dateArr[dateArr.length - 2]) >= 10 ? parseInt(dateArr[dateArr.length - 2]) : ('0' + parseInt(dateArr[dateArr.length - 2]))
      const day = parseInt(dateArr[dateArr.length - 1]) >= 10 ? parseInt(dateArr[dateArr.length - 1]) : ('0' + parseInt(dateArr[dateArr.length - 1]))
      const hour = parseInt(clockArr[0]) >= 10 ? parseInt(clockArr[0]) : ('0' + parseInt(clockArr[0]))
      const min = parseInt(clockArr[1]) >= 10 ? parseInt(clockArr[1]) : ('0' + parseInt(clockArr[1]))
      let val = month + '月' + day + '日' + [hour, min].join(':')
      this.setData({
        beginTime: val,
        qgRemind: data.is_book_remind
      })
    },
    remindTap: function (e) {
      if (!util.checkLogin('navPermission')) {
        return false
      }
      const {goodsStatusData: {start_qg}, remindRequesting, qgRemind} = this.data
      if (remindRequesting) {
        return false
      }
      if (start_qg && start_qg > 0 && !qgRemind && !this.remindAble) { // 未设置提醒 且 距开始抢购不足15分钟
        wx.showToast({
          title: '距开抢不足15分钟了，准备开抢吧~',
          icon: 'none',
          duration: 3000
        })
        return false
      }
      const {formId, value: { id }} = e.detail
      let rData = {form_id: formId, id, cancel: qgRemind}
      this.setData({
        remindRequesting: true
      })
      wx.vibrateShort()
      util.request('/product/qg_remind', rData).then(res => {
        let _obj = {}
        _obj.remindRequesting = false
        if (res.error == 0) {
          _obj.qgRemind = !qgRemind
          this.triggerEvent('remindchange', {qgRemind: !qgRemind})
          const title = _obj.qgRemind ? '提醒已设置，将在开抢前5分钟提醒您，请留意微信通知' : '开抢提醒已取消，你可能会错过商品哟~'
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 3000
          })
        }
        this.setData(_obj)
      }).catch(err => {
        this.setData({
          remindRequesting: false
        })
      })
    }
  }
})
