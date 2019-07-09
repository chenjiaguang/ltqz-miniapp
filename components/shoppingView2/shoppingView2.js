// components/shoppingView/shoppingView.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    session: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) { // 初始化session
        // 属性值变化时执行
        let session = [].concat(newVal)
        session.forEach((item, idx) => { // 票的价格处理(String -> Number，分保留，另存一份用于展示的价格, 计算时用分，展示时
          item.show_price =  util.formatMoney(item.price).showMoney
          item.price =  util.formatMoney(item.price).money
          item.show_pt_price =  util.formatMoney(item.pt_price).showMoney
          item.pt_price =  util.formatMoney(item.pt_price).money
          item.show_origin_price =  util.formatMoney(item.origin_price).showMoney
          item.origin_price =  util.formatMoney(item.origin_price).money
          item.show_qg_price =  util.formatMoney(item.qg_price).showMoney
          item.qg_price =  util.formatMoney(item.qg_price).money
        })
        this.initSession(session)
      }
    },
    timestamp: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) { // 初始化(重置)session
        // 属性值变化时执行
        if (this.data.session) {
          let session = [].concat(this.data.session)
          session.forEach((item, idx) => { // 票的价格处理(String -> Number，分保留，另存一份用于展示的价格, 计算时用分，展示时
            item.show_price =  util.formatMoney(item.price).showMoney
            item.price =  util.formatMoney(item.price).money
            item.show_pt_price =  util.formatMoney(item.pt_price).showMoney
            item.pt_price =  util.formatMoney(item.pt_price).money
            item.show_origin_price =  util.formatMoney(item.origin_price).showMoney
            item.origin_price =  util.formatMoney(item.origin_price).money
            item.show_qg_price =  util.formatMoney(item.qg_price).showMoney
            item.qg_price =  util.formatMoney(item.qg_price).money
          })
          this.initSession(session)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    stockObj: {
      1: 'stock',
      2: 'stock',
      3: 'qg_stock'
    },
    showSinglePriceObj: {
      1: 'show_price',
      2: 'show_pt_price',
      3: 'show_qg_price'
    },
    singlePriceObj: {
      1: 'price',
      2: 'pt_price',
      3: 'qg_price'
    },
    saletype: '',
    currentSession: { 1: null, 2: null, 3: null },
    currentSubSession: { 1: null, 2: null, 3: null },
    subSessions: { 1: [], 2: [], 3: [] },
    selectedTicketLength: { 1: 0, 2: 0, 3: 0 },
    totalPrice: { 1: 0, 2: 0, 3: 0 }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sessionTap: function (e) {
      const { status, idx } = e.currentTarget.dataset
      const { currentSession, saletype } = this.data
      const session = JSON.parse(JSON.stringify(this.data.showSession))
      if (status === 'disabled' || currentSession[saletype] === idx) { // 售罄 或 点击的是当前的款式
        return false
      }
      const subS = session[idx].sub.map(item => Object.assign({}, item, { num: 0 }))
      let _obj = {}
      _obj['selectedTicketLength.' + saletype] = 0
      _obj['totalPrice.' + saletype] = 0
      _obj['currentSession.' + saletype] = idx
      _obj['currentSubSession.' + saletype] = 0
      _obj['subSessions.' + saletype] = subS
      this.setData(_obj)
    },
    initSession: function (session) {
      console.log('initSession')
      let _session = JSON.parse(JSON.stringify(session))
      let current = null
      let subSessions = []
      const {stockObj, saletype} = this.data
      for (let i = 0; i < _session.length; i++) {
        if (_session[i][stockObj[saletype]] === 0) {
          continue
        }
        current = i
        break
      }
      if (current !== null) {
        subSessions = _session[current].sub.map(item => Object.assign({}, item, { num: 0 }))
      }
      console.log('this.data.session', this.data.session)
      this.setData({
        showSession: _session,
        selectedTicketLength: { 1: 0, 2: 0, 3: 0 },
        totalPrice: { 1: 0, 2: 0, 3: 0 },
        currentSession: { 1: current, 2: current, 3: current },
        currentSubSession: { 1: 0, 2: 0, 3: 0 },
        subSessions: { 1: subSessions, 2: subSessions, 3: subSessions }
      })
    },
    countTicket: function (e) {
      const { stockObj, singlePriceObj, saletype, currentSession } = this.data
      let session = JSON.parse(JSON.stringify(this.data.showSession[currentSession[saletype]]))
      let subSessions = JSON.parse(JSON.stringify(this.data.subSessions[saletype]))
      let selectedTicketLen = 0
      let total = 0
      const { type, idx } = e.currentTarget.dataset
      let subS = subSessions[idx]
      let disabled = session[stockObj[saletype]] === 0 || (subS.num <= 0 && type === 'minus') || (session[stockObj[saletype]] && subS.num >= session[stockObj[saletype]] && type === 'add')
      if (disabled) {
        return false
      }
      subSessions.forEach((item, index) => {
        selectedTicketLen += index === idx ? (item.num + (type === 'minus' ? -1 : 1)) : item.num
        const singlePrice = session[singlePriceObj[saletype]]
        total += index === idx ? ((item.num + (type === 'minus' ? -1 : 1)) * singlePrice) : (item.num * singlePrice)
      })
      let num = subS.num + (type === 'minus' ? -1 : 1)
      let _obj = {}
      _obj['selectedTicketLength.' + saletype] = selectedTicketLen
      _obj['totalPrice.' + saletype] = parseFloat((total / 100).toFixed(2))
      _obj['subSessions.' + saletype + '[' + idx + '].num'] = num
      this.setData(_obj)
    },

    toggleSession: function (e) {
      console.log('toggleSession', e)
      const { saletype, showSession, stockObj } = this.data
      let _saletype = saletype
      if (e && e.currentTarget.dataset.saletype) { // 用于区分团购时点击的是 “单独购买” 还是 “发起拼团” 还是 “商品抢购”
        _saletype = e.currentTarget.dataset.saletype
      }
      let _obj = {}
      if (_saletype != saletype) { // 点击的购买方式不同时，清空原选择数据
        let current = null
        let subSessions = []
        for (let i = 0; i < showSession.length; i++) {
          if (showSession[i][stockObj[_saletype]] === 0) {
            continue
          }
          current = i
          break
        }
        if (current !== null) {
          subSessions = showSession[current].sub.map(item => Object.assign({}, item, { num: 0 }))
        }
        _obj['selectedTicketLength.' + _saletype] = 0
        _obj['totalPrice.' + _saletype] = 0
        _obj['currentSession.' + _saletype] = current
        _obj['currentSubSession.' + _saletype] = 0
        _obj['subSessions.' + _saletype] = subSessions
      }
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
      _obj.saletype = _saletype
      this.setData(_obj)
    },

    order: function () {
      this.toggleSession()
      const { saletype, currentSession, currentSubSession, subSessions, selectedTicketLength, totalPrice} = this.data
      this.triggerEvent('nextstep', { saletype, currentSession, currentSubSession, subSessions, selectedTicketLength, totalPrice})
    },

    stopPropagation: function () {
      return false
    }
  }
})
