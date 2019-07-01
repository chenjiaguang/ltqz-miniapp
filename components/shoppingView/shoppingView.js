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
          item.ticket.forEach(it => {
            it.type.show_price = util.formatMoney(it.type.price).showMoney
            it.type.price = util.formatMoney(it.type.price).money
            it.type.show_pt_price = util.formatMoney(it.type.pt_price).showMoney
            it.type.pr_price = util.formatMoney(it.type.pt_price).money
            it.type.show_origin_price = util.formatMoney(it.type.origin_price).showMoney
            it.type.origin_price = util.formatMoney(it.type.origin_price).money
            it.type.show_qg_price = util.formatMoney(it.type.qg_price).showMoney
            it.type.qg_price = util.formatMoney(it.type.qg_price).money
          })
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
            item.ticket.forEach(it => {
              it.type.show_price = util.formatMoney(it.type.price).showMoney
              it.type.price = util.formatMoney(it.type.price).money
              it.type.show_pt_price = util.formatMoney(it.type.pt_price).showMoney
              it.type.pr_price = util.formatMoney(it.type.pt_price).money
              it.type.show_origin_price = util.formatMoney(it.type.origin_price).showMoney
              it.type.origin_price = util.formatMoney(it.type.origin_price).money
              it.type.show_qg_price = util.formatMoney(it.type.qg_price).showMoney
              it.type.qg_price = util.formatMoney(it.type.qg_price).money
            })
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
    currentTickets: { 1: [], 2: [], 3: [] },
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
      const session = JSON.parse(JSON.stringify(this.data.session))
      if (status === 'disabled' || currentSession[saletype] === idx) { // 售罄 或 点击的是当前的场次
        return false
      }
      const tickets = session[idx].ticket.map(item => Object.assign({}, item, { num: 0 }))
      let _obj = {}
      _obj['selectedTicketLength.' + saletype] = 0
      _obj['totalPrice.' + saletype] = 0
      _obj['currentSession.' + saletype] = idx
      _obj['currentTickets.' + saletype] = tickets
      this.setData(_obj)
    },
    initSession: function (session) {
      console.log('initSession')
      let _session = JSON.parse(JSON.stringify(session))
      let current = null
      let selected = []
      const {stockObj, saletype} = this.data
      for (let i = 0; i < _session.length; i++) {
        if (_session[i][stockObj[saletype]] === 0) {
          continue
        }
        let valid = false
        let tickets = _session[i].ticket
        for (let j = 0; j < tickets.length; j++) {
          if (tickets[j][stockObj[saletype]] === 0) {
            continue
          }
          valid = true
        }
        if (valid) {
          current = i
          break
        }
      }
      if (current !== null) {
        selected = _session[current].ticket.map(item => Object.assign({}, item, { num: 0 }))
      }
      // if (selected && selected.length === 0) {
      //   console.log('selected', selected)
      //   selected[0].num = 1
      //   let _obj = {}
      //   _obj.selectedTicketLength = {1: 1, 2: 1}
      //   _obj.totalPrice = {1: parseFloat((selected[0].type.price * 1 / 100).toFixed(2)), 2: parseFloat((selected[0].type.pt_price * 1 / 100).toFixed(2))}
      //   _obj.currentSession = { 1: current, 2: current },
      //   _obj.currentTickets = { 1: selected, 2: selected }
      //   this.setData(_obj)
      // } else {
      //   this.setData({
      //     selectedTicketLength: { 1: 0, 2: 0 },
      //     totalPrice: { 1: 0, 2: 0 },
      //     currentSession: { 1: current, 2: current },
      //     currentTickets: { 1: selected, 2: selected }
      //   })
      // }
      
      this.setData({
        selectedTicketLength: { 1: 0, 2: 0, 3: 0 },
        totalPrice: { 1: 0, 2: 0, 3: 0 },
        currentSession: { 1: current, 2: current, 3: current },
        currentTickets: { 1: selected, 2: selected, 3: selected }
      })
    },
    countTicket: function (e) {
      const { stockObj, singlePriceObj, saletype } = this.data
      let tickets = JSON.parse(JSON.stringify(this.data.currentTickets[saletype]))
      let selectedTicketLen = 0
      let total = 0
      const { type, idx } = e.currentTarget.dataset
      let ticket = tickets[idx]
      let disabled = ticket[stockObj[saletype]] === 0 || (ticket.num <= 0 && type === 'minus') || (ticket[stockObj[saletype]] && ticket.num >= ticket[stockObj[saletype]] && type === 'add')
      if (disabled) {
        return false
      }
      tickets.forEach((item, index) => {
        selectedTicketLen += index === idx ? (item.num + (type === 'minus' ? -1 : 1)) : item.num
        const singlePrice = item.type[singlePriceObj[saletype]]
        total += index === idx ? ((item.num + (type === 'minus' ? -1 : 1)) * singlePrice) : (item.num * singlePrice)
      })
      let num = ticket.num + (type === 'minus' ? -1 : 1)
      let _obj = {}
      _obj['selectedTicketLength.' + saletype] = selectedTicketLen
      _obj['totalPrice.' + saletype] = parseFloat((total / 100).toFixed(2))
      _obj['currentTickets.' + saletype + '[' + idx + '].num'] = num
      this.setData(_obj)
    },

    toggleSession: function (e) {
      console.log('toggleSession', e)
      const { saletype, currentSession } = this.data
      let _saletype = saletype
      if (e && e.currentTarget.dataset.saletype) { // 用于区分团购时点击的是 “单独购买” 还是 “发起拼团” 还是 “商品抢购”
        _saletype = e.currentTarget.dataset.saletype
      }
      let _obj = {}
      if (_saletype != saletype) { // 点击的购买方式不同时，清空原选择数据
        const current_session = currentSession[_saletype]
        const session = JSON.parse(JSON.stringify(this.data.session))
        const tickets = session[current_session].ticket.map(item => Object.assign({}, item, { num: 0 }))
        _obj['selectedTicketLength.' + _saletype] = 0
        _obj['totalPrice.' + _saletype] = 0
        _obj['currentSession.' + _saletype] = 0
        _obj['currentTickets.' + _saletype] = tickets
      }
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
      _obj.saletype = _saletype
      this.setData(_obj)
    },

    order: function () {
      this.toggleSession()
      const { saletype, currentSession, currentTickets, selectedTicketLength, totalPrice} = this.data
      this.triggerEvent('nextstep', { saletype, currentSession, currentTickets, selectedTicketLength, totalPrice})
    },

    stopPropagation: function () {
      return false
    }
  }
})
