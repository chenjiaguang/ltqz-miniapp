const getBtnText = (type, sale_type, status, qg_status) => {
  let btnText = ''
  let btnDisabled = false
  if (type == 1) { // 活动
    if ((sale_type == 1 || sale_type == 2) || (sale_type == 3 && qg_status != 2 && qg_status != 3)) { // 普通活动 或 拼团 或 抢购模式下（非抢购中、非抢光）
      const textObj = {
        '-3': '已下架',
        '-2': '未上架',
        '-1': '未上架',
        '0': '敬请期待',
        '1': '立即报名',
        '2': '报名已满',
        '3': '报名截止',
        '4': '报名已满',
        '5': '活动结束',
        '6': '报名已满'
      }
      btnText = (sale_type == 3 && qg_status == 1 && (status == 2 || status == 4 || status == 6)) ? '暂不销售' : textObj[status]
      btnDisabled = status != 1
    } else if (sale_type == 3 && (qg_status == 2 || qg_status == 3)) { // 抢购模式下（抢购中、已抢光）
      const textObj = {
        '-3': '已下架',
        '-2': '未上架',
        '-1': '未上架',
        '0': '立即报名',
        '1': '立即报名',
        '2': '立即抢购',
        '3': '已抢光',
        '8': '立即报名'
      }
      btnText = textObj[qg_status]
      btnDisabled = status != 1 || qg_status != 2
    }
  } else if (type == 2 || type == 3) { // 非活动
    if ((sale_type == 1 || sale_type == 2) || (sale_type == 3 && qg_status != 2 && qg_status != 3)) { // 普通活动 或 拼团 或 抢购模式下（非抢购中、非抢光）
      const textObj = {
        '-3': '已下架',
        '-2': '未上架',
        '-1': '未上架',
        '0': '敬请期待',
        '1': '立即购买',
        '2': '已售罄',
        '3': '已售罄',
        '4': '已售罄',
        '5': '已售罄',
        '6': '已售罄'
      }
      btnText = (sale_type == 3 && qg_status == 1 && (status == 2 || status == 4 || status == 6)) ? '暂不销售' : textObj[status]
      btnDisabled = status != 1
    } else if (sale_type == 3 && (qg_status == 2 || qg_status == 3)) { // 抢购
      const textObj = {
        '-3': '已下架',
        '-2': '未上架',
        '-1': '未上架',
        '0': '立即购买',
        '1': '立即购买',
        '2': '立即抢购',
        '3': '已抢光',
        '8': '已抢光'
      }
      btnText = textObj[qg_status]
      btnDisabled = status != 1 || qg_status != 2
    }
  }
  return {btnText, btnDisabled}
}

const getCardText = (type, sale_type, status, qg_status) => {
  let statusText = ''
  let statusDisabled = false
  if (type == 1) {
    if ((sale_type == 1 || sale_type == 2) || (sale_type == 3 && qg_status != 2 && qg_status != 3)) {
      const textObj = {
        '-3': '已下架',
        '-2': '未上架',
        '-1': '未上架',
        '0': '未上架',
        '1': '', // 原为报名中
        '2': '已满额',
        '3': '已截止',
        '4': '已满额',
        '5': '已结束',
        '6': '已满额'
      }
      statusText = textObj[status]
      statusDisabled = status != 1
      if (sale_type == 3 && qg_status == 1) {
        statusText = '预热中'
        statusDisabled = status != 1
      }
    } else if (sale_type == 3 && (qg_status == 2 || qg_status == 3)) {
      const textObj = {
        '-3': '已下架',
        '-2': '未上架',
        '-1': '未上架',
        '0': '未上架',
        '1': '预热中',
        '2': '抢购中',
        '3': '已抢光',
        '8': '已结束'
      }
      statusText = textObj[qg_status]
      statusDisabled = status != 1 || qg_status != 2
    }
  } else if (type == 2 || type == 3) { // 非活动
    if ((sale_type == 1 || sale_type == 2) || (sale_type == 3 && qg_status != 2 && qg_status != 3)) {
      const textObj = {
        '-3': '已下架',
        '-2': '未上架',
        '-1': '未上架',
        '0': '未上架',
        '1': '', // 原为出售中
        '2': '已售罄',
        '3': '已售罄',
        '4': '已售罄',
        '5': '已售罄',
        '6': '已售罄'
      }
      statusText = textObj[status]
      statusDisabled = status != 1
      if (sale_type == 3 && qg_status == 1) {
        statusText = '预热中'
        statusDisabled = status != 1
      }
    } else if (sale_type == 3 && (qg_status == 2 || qg_status == 3)) {
      const textObj = {
        '-3': '已下架',
        '-2': '未上架',
        '-1': '未上架',
        '0': '未上架',
        '1': '预热中',
        '2': '抢购中',
        '3': '已抢光',
        '8': '已售罄'
      }
      statusText = textObj[qg_status]
      statusDisabled = status != 1 || qg_status != 2
    }
  }
  return {statusText, statusDisabled}
}

const getStatusText = (type, sale_type, status, qg_status) => {
  let text = ''
  if (type == 1) { // 活动
    const textObj = {
      '-3': '活动已下架',
      '-2': '活动未上架',
      '-1': '活动未上架',
      '0': '活动未上架',
      '1': '', // 原为活动报名中
      '2': '', // 原为活动报名中
      '3': '报名已结束',
      '4': '报名已结束',
      '5': '活动已结束',
      '6': '' // 原为活动报名中
    }
    text = textObj[status]
  } else if (type == 2 || type == 3) { // 非活动
    const textObj = {
      '-3': '商品已下架',
      '-2': '商品未上架',
      '-1': '商品未上架',
      '0': '商品未上架',
      '1': '', // 原为商品出售中
      '2': '', // 原为商品出售中
      '3': '商品已售罄',
      '4': '商品已售罄',
      '5': '商品已售罄',
      '6': '商品已售罄'
    }
    text = textObj[status]
  }
  return text
}

const getStatusTipText = (type, sale_type, status, qg_status) => {
  let statusTipText = ''
  if (type == 1) { // 活动
    if ((sale_type == 1 || sale_type == 2) || (sale_type == 3 && qg_status != 2 && qg_status != 3)) { // 普通活动 或 拼团 或 抢购模式下（非抢购中、非抢光）
      const textObj = {
        '-3': '',
        '-2': '',
        '-1': '',
        '0': '',
        '1': '',
        '2': '本次活动报名已满额',
        '3': '本次活动报名已截止',
        '4': '本次活动报名已满额',
        '5': '本次活动已结束',
        '6': '本次活动报名已满额'
      }
      statusTipText = (sale_type == 3 && qg_status == 1 && (status == 2 || status == 4 || status == 6)) ? '' : textObj[status]
    } else if (sale_type == 3 && (qg_status == 2 || qg_status == 3)) { // 抢购模式下（抢购中、已抢光）
      statusTipText = ''
    }
    if (sale_type == 2) {
      statusTipText = ''
    }
  } else if (type == 2 || type == 3) { // 非活动
    if ((sale_type == 1 || sale_type == 2) || (sale_type == 3 && qg_status != 2 && qg_status != 3)) { // 普通活动 或 拼团 或 抢购模式下（非抢购中、非抢光）
      const textObj = {
        '-3': '',
        '-2': '',
        '-1': '',
        '0': '',
        '1': '',
        '2': '本商品已售罄',
        '3': '本商品已售罄',
        '4': '本商品已售罄',
        '5': '本商品已售罄',
        '6': '本商品已售罄'
      }
      statusTipText = (sale_type == 3 && qg_status == 1 && (status == 2 || status == 4 || status == 6)) ? '' : textObj[status]
    } else if (sale_type == 3 && (qg_status == 2 || qg_status == 3)) { // 抢购
      statusTipText = ''
    }
    if (sale_type == 2) {
      statusTipText = ''
    }
  }
  statusTipText = '' // 固定去掉详情页的状态栏
  return statusTipText
}

const getPriceText = (type, sale_type, status, qg_status, show_min_price, show_min_pt_price, show_min_qg_price, price_num) => {
  let priceText = ''
  let isFree = false
  let hasMore = false
  if (type == 1 || type == 2 || type == 3) { // 活动 或 商品都是相同的字段
    if (sale_type == 1 || (sale_type == 3 && qg_status != 2 && qg_status != 3)) { // 普通
      priceText = (show_min_price && show_min_price) > 0 ? show_min_price : '免费'
      isFree = !show_min_price || show_min_price == 0
      hasMore = price_num > 1 && show_min_price && show_min_price > 0
    } else if (sale_type == 2) { // 拼团
      priceText = (show_min_pt_price && show_min_pt_price > 0) ? show_min_pt_price : '免费'
      isFree = !show_min_pt_price || show_min_pt_price == 0
      hasMore = price_num > 1 && show_min_pt_price && show_min_pt_price > 0
    } else if (sale_type == 3 && (qg_status == 2 || qg_status == 3)) { // 抢购
      priceText = (show_min_qg_price && show_min_qg_price > 0) ? show_min_qg_price : '免费'
      isFree = !show_min_qg_price || show_min_qg_price == 0
      hasMore = price_num > 1 && show_min_qg_price && show_min_qg_price > 0
    }
  }
  return {
    priceText,
    isFree,
    hasMore
  }
}

module.exports = {
  getBtnText,
  getCardText,
  getStatusText,
  getStatusTipText,
  getPriceText
}