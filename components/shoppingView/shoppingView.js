// components/shoppingView/shoppingView.js
import util from '../../utils/util.js'
import storageHelper from '../../utils/storageHelper.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    remainCount: null,
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
            it.type.pt_price = util.formatMoney(it.type.pt_price).money
            it.type.show_origin_price = util.formatMoney(it.type.origin_price).showMoney
            it.type.origin_price = util.formatMoney(it.type.origin_price).money
            it.type.show_qg_price = util.formatMoney(it.type.qg_price).showMoney
            it.type.qg_price = util.formatMoney(it.type.qg_price).money
          })
        })
        this.initSession(session, this.data.saletype)
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
              it.type.pt_price = util.formatMoney(it.type.pt_price).money
              it.type.show_origin_price = util.formatMoney(it.type.origin_price).showMoney
              it.type.origin_price = util.formatMoney(it.type.origin_price).money
              it.type.show_qg_price = util.formatMoney(it.type.qg_price).showMoney
              it.type.qg_price = util.formatMoney(it.type.qg_price).money
            })
          })
          this.initSession(session, this.data.saletype)
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
    currentTickets: { 1: [], 2: [], 3: [] },
    selectedTicketLength: { 1: 0, 2: 0, 3: 0 },
    totalPrice: { 1: 0, 2: 0, 3: 0 }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    searchFirstAble: function (session, stockObj, saletype) { // 自动寻找第一个可购买的款式
      let ableSessionIdx = null
      let ableTicketIdx = null
      for (let i = 0; i < session.length; i++) {
        if (session[i][stockObj[saletype]] === 0) { // 没有库存不可选
          continue
        }
        // if (saletype == 3 && this.data.remainCount == 0 ) { // 抢购模式 且 剩余数量为0
        //   continue
        // }
        let valid = false
        let tickets = session[i].ticket
        for (let j = 0; j < tickets.length; j++) {
          if (tickets[j][stockObj[saletype]] === 0) {
            continue
          }
          ableTicketIdx = j
          valid = true
          break
        }
        if (valid) {
          ableSessionIdx = i
          break
        }
      }
      if (saletype == 3 && this.data.remainCount == 0 ) { // 抢购模式 且 剩余数量为0, limit表示是否限制购买
        return {ableSessionIdx, ableTicketIdx, limit: true }
      }
      return {ableSessionIdx, ableTicketIdx, limit: false}
    },
    sessionTap: function (e) {
      const { status, idx } = e.currentTarget.dataset
      const { currentSession, saletype, remainCount } = this.data
      const session = JSON.parse(JSON.stringify(this.data.session))
      if (status === 'disabled' || currentSession[saletype] === idx) { // 售罄 或 点击的是当前的场次
        return false
      }
      // if (saletype == 3 && remainCount == 0) { // 抢购模式 且 剩余数量为0
      //   return false
      // }
      this.initSession(session, saletype, idx)
    },
    subSessionTap: function (e) {
      const { idx } = e.currentTarget.dataset
      const { session, currentTickets, currentSession, currentSubSession, saletype, stockObj } = this.data
      let ticket = currentTickets[saletype][idx]
      if (currentSubSession[saletype] === idx || ticket[stockObj[saletype]] === 0) { // 点击的是当前的规格 或 库存为0
        return false
      }
      this.initSession(session, saletype, currentSession[saletype], idx)
    },
    initSession: function (session, saletype, idx, subIdx) { // session 场次信息 | saletype 拉起的是什么模式 | 是否有
      let _session = JSON.parse(JSON.stringify(session))
      let selected = []
      const {singlePriceObj, stockObj} = this.data
      let idxObj = this.searchFirstAble(_session, stockObj, saletype)
      let {ableSessionIdx, ableTicketIdx, limit} = idxObj
      
      ableSessionIdx = (idx == 0) ? idx : (idx || ableSessionIdx)
      // if (!(idx || idx === 0) && _session.length > 1) { // 如果idx不存在，则说明不是主动点击，该情况如果场次不止一个，则重置ableSessionIdx为null
      //   ableSessionIdx = null
      // }

      let selectedTicketLength = { 1: 0, 2: 0, 3: 0 }
      let totalPrice = { 1: 0, 2: 0, 3: 0 }
      let currentSession = { 1: null, 2: null, 3: null }
      let currentSubSession = { 1: null, 2: null, 3: null }
      let currentTickets = { 1: [], 2: [], 3: [] }
      if (ableSessionIdx !== null) { // 已有选择场次
        selected = _session[ableSessionIdx].ticket.map(item => Object.assign({}, item, { num: 0 }))
      }
      if (selected.length > 0 && !limit) { // 已有选择场次 且 未限制购买，则可以初始化选择一个
        // 如果已选择的场次不止一张票，则重置ableTicketIdx为null
        let len = 0
        let selSubIdx = null
        selected.forEach((item, idx) => {
          if (item[stockObj[saletype]] === null || (item[stockObj[saletype]] && item[stockObj[saletype]] > 0)) {
            len += 1
            selSubIdx = len === 1 ? idx : null
          }
        })
        if (subIdx === 0 || subIdx) {
          let able = selected[subIdx][stockObj[saletype]] === null || (selected[subIdx][stockObj[saletype]] && selected[subIdx][stockObj[saletype]] > 0)
          if (able) {
            selSubIdx = subIdx
          }
        }
        // 初始选择个数initNum
        const initNum = (selSubIdx === null) ? 0 : 1
        let singlePrice = 0

        if (selSubIdx !== null) {
          currentSubSession[saletype] = selSubIdx
          singlePrice = selected[selSubIdx].type[singlePriceObj[saletype]]
          selected[selSubIdx].num = initNum
        }
        
        selectedTicketLength[saletype] = initNum
        totalPrice[saletype] = parseFloat((initNum * singlePrice / 100).toFixed(2))
      }

      currentSession[saletype] = ableSessionIdx
      currentTickets[saletype] = selected

      this.setData({
        saletype: saletype,
        selectedTicketLength,
        totalPrice,
        currentSession,
        currentSubSession,
        currentTickets
      })
    },
    countTicket: function (e) {
      const { stockObj, singlePriceObj, saletype, remainCount, currentTickets, currentSession, selectedTicketLength } = this.data
      if (currentSession[saletype] === null) { // 未选中一级规格
        wx.showToast({
          title: '未选择场次',
          icon: 'none'
        })
        return false
      }
      let tickets = currentTickets[saletype]
      let selectedTicketLen = 0
      let total = 0
      const { type, idx } = e.currentTarget.dataset
      if (tickets && (!tickets.length || (tickets.length > 0 && idx !== 0 && !idx))) { // 有二级规格，但未选中
        wx.showToast({
          title: '未选择票种',
          icon: 'none'
        })
        return false
      }
      let ticket = tickets[idx]
      if (!ticket) {
        return false
      }
      if (ticket && ticket[stockObj[saletype]] === 0) { // 没有库存
        return false
      }
      if (ticket && ticket.num <= 0 && type === 'minus') { // 点击的是减号，且当前小于或等于0
        return false
      }
      if (ticket[stockObj[saletype]] && ticket.num >= ticket[stockObj[saletype]] && type === 'add') { // 有库存限制 且 点击的是加号 且 当前大于或等于库存
        return false
      }
      if (saletype == 3 && (remainCount == 0 || remainCount && selectedTicketLength[saletype] >= remainCount && type === 'add')) { // 抢购模式 且 （抢购剩余为0 或 当前大于等于抢购限制）
        wx.showToast({
          title: '您已经达到限购上限了，留点给其他用户吧~',
          icon: 'none'
        })
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
      const { saletype } = this.data
      let _saletype = saletype
      if (e && e.currentTarget.dataset.saletype) { // 用于区分团购时点击的是 “单独购买” 还是 “发起拼团” 还是 “商品抢购”
        _saletype = e.currentTarget.dataset.saletype
      }
      if (_saletype != saletype) { // 点击的购买方式不同时，清空原选择数据
        this.initSession(this.data.session, _saletype)
      }
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
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
