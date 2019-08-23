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
          if (item.sub && item.sub.legnth) {
            item.sub.forEach(sitem => {
              sitem.show_price =  util.formatMoney(sitem.price).showMoney
              sitem.price =  util.formatMoney(sitem.price).money
              sitem.show_pt_price =  util.formatMoney(sitem.pt_price).showMoney
              sitem.pt_price =  util.formatMoney(sitem.pt_price).money
              sitem.show_origin_price =  util.formatMoney(sitem.origin_price).showMoney
              sitem.origin_price =  util.formatMoney(sitem.origin_price).money
              sitem.show_qg_price =  util.formatMoney(sitem.qg_price).showMoney
              sitem.qg_price =  util.formatMoney(sitem.qg_price).money
            })
          }
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
            if (item.sub && item.sub.legnth) {
              item.sub.forEach(sitem => {
                sitem.show_price =  util.formatMoney(sitem.price).showMoney
                sitem.price =  util.formatMoney(sitem.price).money
                sitem.show_pt_price =  util.formatMoney(sitem.pt_price).showMoney
                sitem.pt_price =  util.formatMoney(sitem.pt_price).money
                sitem.show_origin_price =  util.formatMoney(sitem.origin_price).showMoney
                sitem.origin_price =  util.formatMoney(sitem.origin_price).money
                sitem.show_qg_price =  util.formatMoney(sitem.qg_price).showMoney
                sitem.qg_price =  util.formatMoney(sitem.qg_price).money
              })
            }
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
    currentStock: { 1: '', 2: '', 3: '' },
    subSessions: { 1: [], 2: [], 3: [] },
    selectedTicketLength: { 1: 0, 2: 0, 3: 0 },
    totalPrice: { 1: 0, 2: 0, 3: 0 },
    totalPriceCal: { 1: 0, 2: 0, 3: 0 }
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
      if (showSession[idx][stockObj[saletype]] == 0 || currentSession[saletype] === idx) { // 没有库存 或 点击的是当前的款式
        return false
      }
      // if (saletype == 3 && this.data.remainCount == 0) { // 抢购模式 且 剩余数量为0
      //   return false
      // }
      this.initSession(showSession, saletype, idx)
    },
    subSessionTap: function (e) {
      const { idx } = e.currentTarget.dataset
      const { showSession, subSessions, currentSession, currentSubSession, saletype, remainCount, stockObj } = this.data
      if (subSessions[saletype][idx][stockObj[saletype]] == 0 || currentSubSession[saletype] === idx) { // 没有库存 或 点击的是当前的规格
        return false
      }
      if (saletype == 3 && remainCount == 0) { // 抢购模式 且 抢购剩余为0
        wx.showToast({
          title: '您已经达到限购上限了，留点给其他用户吧~',
          icon: 'none'
        })
        return false
      }
      this.initSession(showSession, saletype, currentSession[saletype], idx)
    },
    initSession: function (session, saletype, idx, subIdx) {
      let _session = JSON.parse(JSON.stringify(session))
      const {singlePriceObj, stockObj} = this.data
      let _subSessions = []
      let idxObj = this.searchFirstAble(_session, stockObj, saletype)
      let {ableSessionIdx, limit} = idxObj
      let current = (idx == 0) ? idx : (idx || ableSessionIdx)
      // if (!(idx || idx === 0) && _session.length > 1) { // 如果idx不存在，则说明不是主动点击，该情况如果场次不止一个，则重置current为null
      //   current = null
      // }

      let selectedTicketLength = { 1: 0, 2: 0, 3: 0 }
      let totalPriceCal = { 1: 0, 2: 0, 3: 0 }
      let totalPrice = { 1: 0, 2: 0, 3: 0 }
      let currentSession = { 1: null, 2: null, 3: null }
      let currentSubSession = { 1: null, 2: null, 3: null }
      let currentStock = { 1: '', 2: '', 3: '' }
      let subSessions = { 1: [], 2: [], 3: [] }

      if (current !== null) {
        _subSessions = _session[current].sub.map(item => Object.assign({}, item, {num: 0}))
      }

      if (current !== null && !limit) { // 已有选择款式 且 未限制购买，则可以初始化选择一个
        let singlePrice = 0
        // let subIndex = (subIdx === 0) ? subIdx : (subIdx || ((_subSessions && _subSessions.length) ? 0 : null))
        let subIndex = null
        if ((subIdx === 0 || subIdx)) {
          if (_subSessions && _subSessions.length && _subSessions[subIdx][stockObj[saletype]] !== 0) {
            subIndex = subIdx
            singlePrice = _subSessions[subIndex][singlePriceObj[saletype]]
          }
        } else {
          if (_subSessions && _subSessions.length) {
            let subIdxObj = this.searchFirstAble(_subSessions, stockObj, saletype)
            let {ableSessionIdx: subAbleSessionIdx} = subIdxObj
            subIndex = subAbleSessionIdx
            singlePrice = _subSessions[subIndex][singlePriceObj[saletype]]
          } else {
            singlePrice = _session[current][singlePriceObj[saletype]]
          }
        }
        // 如果已选择的款式不止一个二级款式 且 不是手动选择的，则重置subIndex为null
        if (_subSessions.length > 1 && !(subIdx || subIdx === 0)) {
          subIndex = null
          singlePrice = 0
        }
        // 初始选择个数initNum
        const initNum = _subSessions.length == 0 ? 1 : (subIndex === null ? 0 : 1)
        if (initNum !== 0) {
          totalPriceCal[saletype] = parseInt(initNum * singlePrice)
          totalPrice[saletype] = parseFloat((initNum * singlePrice / 100).toFixed(2))
        }
        if (current && !_subSessions || _subSessions.length === 0) {
          currentStock[saletype] = _session[current][stockObj[saletype]]
        }
        if (subIndex !== null) {
          _subSessions[subIndex].num = initNum
          currentStock[saletype] = _subSessions[subIndex][stockObj[saletype]]
        }

        selectedTicketLength[saletype] = initNum
        currentSubSession[saletype] = subIndex
      }
      
      
      currentSession[saletype] = current
      subSessions[saletype] = _subSessions
      this.setData({
        saletype: saletype,
        showSession: _session,
        selectedTicketLength,
        totalPriceCal,
        totalPrice,
        currentSession,
        currentSubSession,
        currentStock,
        subSessions
      })
    },
    countTicket: function (e) {
      const { stockObj, singlePriceObj, saletype, currentSession, currentSubSession, currentStock, selectedTicketLength } = this.data
      if (currentSession[saletype] === null) { // 未选中一级规格
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        })
        return false
      }
      let session = JSON.parse(JSON.stringify(this.data.showSession[currentSession[saletype]]))
      let subSessions = JSON.parse(JSON.stringify(this.data.subSessions[saletype]))
      if (subSessions && subSessions.length > 0 && currentSubSession[saletype] === null) { // 有二级规格，但未选中
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        })
        return false
      }
      let total = 0
      const { type, idx } = e.currentTarget.dataset
      let stock = currentStock[saletype]
      if (stock === 0) { // 没有库存
        return false
      }
      if (selectedTicketLength[saletype] <= 0 && type === 'minus') { // 点击的是减号，且当前小于或等于0
        return false
      }
      if (stock && selectedTicketLength[saletype] >= stock && type === 'add') { // 有库存限制 且 点击的是加号 且 当前大于或等于库存
        return false
      }
      if (saletype == 3 && (this.data.remainCount == 0 || this.data.remainCount && selectedTicketLength[saletype] >= this.data.remainCount && type === 'add')) { // 抢购模式 且 （抢购剩余为0 或 当前大于等于抢购限制）
        wx.showToast({
          title: '您已经达到限购上限了，留点给其他用户吧~',
          icon: 'none'
        })
        return false
      }
      // subSessions.forEach((item, index) => {
      //   selectedTicketLen += index === idx ? (item.num + (type === 'minus' ? -1 : 1)) : item.num
      //   const singlePrice = session[singlePriceObj[saletype]]
      //   total += index === idx ? ((item.num + (type === 'minus' ? -1 : 1)) * singlePrice) : (item.num * singlePrice)
      // })

      let num = selectedTicketLength[saletype] + (type === 'minus' ? -1 : 1)
      const singlePrice = (subSessions && subSessions.length > 0 && currentSubSession[saletype]) ? subSessions[currentSubSession[saletype]][singlePriceObj[saletype]] : session[singlePriceObj[saletype]]
      total = num * singlePrice

      let _obj = {}
      _obj['selectedTicketLength.' + saletype] = num
      _obj['totalPriceCal.' + saletype] = parseInt(total)
      _obj['totalPrice.' + saletype] = parseFloat((total / 100).toFixed(2))
      if (idx) {
        _obj['subSessions.' + saletype + '[' + idx + '].num'] = num
      }
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
      const { saletype, currentSession, currentSubSession, subSessions, selectedTicketLength, totalPrice, totalPriceCal} = this.data
      this.triggerEvent('nextstep', { saletype, currentSession, currentSubSession, subSessions, selectedTicketLength, totalPrice, totalPriceCal})
    },

    stopPropagation: function () {
      return false
    }
  }
})
