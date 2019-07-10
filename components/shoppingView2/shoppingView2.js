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
          item.show_price =  util.formatMoney(item.price).showMoney
          item.price =  util.formatMoney(item.price).money
          item.show_pt_price =  util.formatMoney(item.pt_price).showMoney
          item.pt_price =  util.formatMoney(item.pt_price).money
          item.show_origin_price =  util.formatMoney(item.origin_price).showMoney
          item.origin_price =  util.formatMoney(item.origin_price).money
          item.show_qg_price =  util.formatMoney(item.qg_price).showMoney
          item.qg_price =  util.formatMoney(item.qg_price).money
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
            item.show_price =  util.formatMoney(item.price).showMoney
            item.price =  util.formatMoney(item.price).money
            item.show_pt_price =  util.formatMoney(item.pt_price).showMoney
            item.pt_price =  util.formatMoney(item.pt_price).money
            item.show_origin_price =  util.formatMoney(item.origin_price).showMoney
            item.origin_price =  util.formatMoney(item.origin_price).money
            item.show_qg_price =  util.formatMoney(item.qg_price).showMoney
            item.qg_price =  util.formatMoney(item.qg_price).money
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
    saletype: '1',
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
    searchFirstAble: function (session, stockObj, saletype) { // 自动寻找第一个可购买的款式
      let ableSessionIdx = null
      for (let i = 0; i < session.length; i++) {
        if (session[i][stockObj[saletype]] === 0) { // 没有库存不可选
          continue
        }
        // if (saletype == 3 && this.data.remainCount == 0 ) { // 抢购模式 且 剩余数量为0
        //   continue
        // }
        ableSessionIdx = i
        break
      }
      if (saletype == 3 && this.data.remainCount == 0 ) { // 抢购模式 且 剩余数量为0
        return {ableSessionIdx, limit: true}
      }
      return {ableSessionIdx, limit: false}
    },
    sessionTap: function (e) {
      const { idx } = e.currentTarget.dataset
      const { showSession, currentSession, saletype, stockObj } = this.data
      if (showSession[currentSession[saletype]][stockObj[saletype]] == 0 || currentSession[saletype] === idx) { // 没有库存 或 点击的是当前的款式
        return false
      }
      // if (saletype == 3 && this.data.remainCount == 0) { // 抢购模式 且 剩余数量为0
      //   return false
      // }
      this.initSession(showSession, saletype, idx)
      // const subS = showSession[idx].sub.map(item => Object.assign({}, item, { num: 0 }))
      // let _obj = {}
      // _obj['selectedTicketLength.' + saletype] = 0
      // _obj['totalPrice.' + saletype] = 0
      // _obj['currentSession.' + saletype] = idx
      // _obj['currentSubSession.' + saletype] = 0
      // _obj['subSessions.' + saletype] = subS
      // this.setData(_obj)
    },
    subSessionTap: function (e) {
      const { idx } = e.currentTarget.dataset
      const { showSession, currentSession, currentSubSession, saletype } = this.data
      if (currentSubSession[saletype] === idx) { // 点击的是当前的规格
        return false
      }
      this.initSession(showSession, saletype, currentSession[saletype], idx)
      // const _subSessions = subSessions[saletype]
      // _subSessions.forEach(item => {
      //   item.num = 0
      // })
      // let _obj = {}
      // _obj['selectedTicketLength.' + saletype] = 0
      // _obj['totalPrice.' + saletype] = 0
      // _obj['currentSubSession.' + saletype] = idx
      // _obj['subSessions.' + saletype] = _subSessions
      // this.setData(_obj)
      // const { status, idx } = e.currentTarget.dataset
      // const { currentSession, saletype } = this.data
      // const session = JSON.parse(JSON.stringify(this.data.showSession))
      // if (status === 'disabled' || currentSession[saletype] === idx) { // 售罄 或 点击的是当前的款式
      //   return false
      // }
      // const subS = session[idx].sub.map(item => Object.assign({}, item, { num: 0 }))
      // let _obj = {}
      // _obj['selectedTicketLength.' + saletype] = 0
      // _obj['totalPrice.' + saletype] = 0
      // _obj['currentSession.' + saletype] = idx
      // _obj['currentSubSession.' + saletype] = 0
      // _obj['subSessions.' + saletype] = subS
      // this.setData(_obj)
    },
    initSession: function (session, saletype, idx, subIdx) {
      let _session = JSON.parse(JSON.stringify(session))
      const {singlePriceObj, stockObj} = this.data
      let _subSessions = []
      let idxObj = this.searchFirstAble(_session, stockObj, saletype)
      let {ableSessionIdx, limit} = idxObj
      let current = idx == 0 ? idx : (idx || ableSessionIdx)

      let selectedTicketLength = { 1: 0, 2: 0, 3: 0 }
      let totalPrice = { 1: 0, 2: 0, 3: 0 }
      let currentSession = { 1: null, 2: null, 3: null }
      let currentSubSession = { 1: null, 2: null, 3: null }
      let subSessions = { 1: [], 2: [], 3: [] }

      if (current !== null) {
        _subSessions = _session[current].sub.map(item => Object.assign({}, item, { num: 0 }))
      }

      if (!limit) { // 未限制购买，则可以初始化选择一个
        const subIndex = subIdx || 0
        const initNum = 1
        const singlePrice = _session[current][singlePriceObj[saletype]]
        _subSessions[subIndex].num = initNum

        selectedTicketLength[saletype] = initNum
        totalPrice[saletype] = parseFloat((initNum * singlePrice / 100).toFixed(2))
        currentSubSession[saletype] = subIndex
      }
      
      currentSession[saletype] = current
      subSessions[saletype] = _subSessions
      this.setData({
        saletype: saletype,
        showSession: _session,
        selectedTicketLength,
        totalPrice,
        currentSession,
        currentSubSession,
        subSessions
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
      console.log('subS', subS, idx)
      if (session[stockObj[saletype]] === 0) { // 没有库存
        return false
      }
      if (subS.num <= 0 && type === 'minus') { // 点击的是减号，且当前小于或等于0
        return false
      }
      if (session[stockObj[saletype]] && subS.num >= session[stockObj[saletype]] && type === 'add') { // 有库存限制 且 点击的是加号 且 当前大于或等于库存
        return false
      }
      if (saletype == 3 && (this.data.remainCount == 0 || this.data.remainCount && subS.num >= this.data.remainCount && type === 'add')) { // 抢购模式 且 （抢购剩余为0 或 当前大于等于抢购限制）
        wx.showToast({
          title: '您已经达到限购上限了，留点给其他用户吧~',
          icon: 'none'
        })
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
      const { saletype } = this.data
      let _saletype = saletype
      if (e && e.currentTarget.dataset.saletype) { // 用于区分团购时点击的是 “单独购买” 还是 “发起拼团” 还是 “商品抢购”
        _saletype = e.currentTarget.dataset.saletype
      }
      if (_saletype != saletype) { // 点击的购买方式不同时，清空原选择数据
        this.initSession(this.data.showSession, _saletype)
      }
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
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
