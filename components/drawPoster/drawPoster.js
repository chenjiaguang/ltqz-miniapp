// components/drawPoster/drawPoster.js
import util from '../../utils/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideComponent: { // 是否在分享时显示相应的界面
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fetching: false, // 是否正在拉取数据
    drawing: false, // 是否正在画图
    cardDrawing: false, // 是否正在画卡片图
    huodongId: '',
    tuanId: '',
    localPoster: '',
    localCardPoster: '',
    fenxiao_price: '',
    canShareFriend: false,
    canSharePengyouquan: false,
    showHideClass: {
      1: ' hide',
      2: ' show'
    },
    uid: ''
  },

  attached: function () {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    drawCard: function (drawSuccess) { // drawSuccess在生成图片成功时会回调，并传入图片临时地址
      this.setData({
        cardDrawing: true
      }, () => {
        this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing, cardDrawing: this.data.cardDrawing, canShareFriend: this.data.canShareFriend, canSharePengyouquan: this.data.canSharePengyouquan })
      })
      this.createSelectorQuery().select('#card-wrapper').boundingClientRect(rect => {
        const ctx = wx.createCanvasContext('c-draw-poster-card', this)
        ctx.fillStyle = '#FFFFFF'
        this.cardPosterWidth = rect.width
        this.cardPosterHeight = rect.height
        ctx.fillRect(0, 0, rect.width, rect.height)
        this.createSelectorQuery().selectAll('.draw-image-card').fields({
          dataset: true,
          rect: true,
          size: true,
          scrollOffset: true,
          properties: ['src'],
          computedStyle: ['borderRadius', 'boxShadow'],
        }, res => {
          this.drawImage(res, ctx, 0, drawSuccess, true)
        }).exec()
      }).exec()
    },
    draw: function (drawSuccess) { // drawSuccess在生成图片成功时会回调，并传入图片临时地址
      this.setData({
        drawing: true
      }, () => {
        this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing, cardDrawing: this.data.cardDrawing, canShareFriend: this.data.canShareFriend, canSharePengyouquan: this.data.canSharePengyouquan })
      })
      this.createSelectorQuery().select('#wrapper').boundingClientRect(rect => {
        const ctx = wx.createCanvasContext('c-draw-poster', this)
        const grd = ctx.createLinearGradient(0, 0, 0, rect.height)
        grd.addColorStop(0, '#F086A1')
        grd.addColorStop(1, '#F1416A')

        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0, rect.width, rect.height)
        this.posterWidth = rect.width
        this.posterHeight = rect.height
        const rd = 12 / 750 * rect.width
        const padding = 32 / 750 * rect.width
        const lineLen1 = 22 / 750 * rect.width
        const lineLen2 = (rect.width - padding * 2 - lineLen1 * 2) / 19
        const circleR = lineLen2 / 2
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = 'transparent'
        ctx.fillStyle = '#FFFFFF'
        ctx.arc(padding + rd, padding + rd, rd, Math.PI, 3 / 2 * Math.PI)
        ctx.lineTo(rect.width - (padding + rd), padding)
        ctx.arc(rect.width- (padding + rd), padding + rd, rd, 3 / 2 * Math.PI, 2 * Math.PI)
        ctx.lineTo(rect.width - padding, rect.height - padding)
        ctx.lineTo(rect.width - padding - lineLen1, rect.height - padding)
        for (let i = 0; i < 10; i++) {
          if (i === 0) {
            ctx.arc(rect.width - padding - lineLen1 - (i + 1) * circleR, rect.height - padding, circleR, 0, Math.PI, true)
          } else {
            ctx.lineTo(rect.width - padding - lineLen1 - i * lineLen2 - i * circleR * 2, rect.height - padding)
            ctx.arc(rect.width - padding - lineLen1 - i * lineLen2 - (2 * i + 1) * circleR, rect.height - padding, circleR, 0, Math.PI, true)
          }
        }
        ctx.lineTo(padding, rect.height - padding)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
        ctx.draw()
        ctx.restore()
        this.createSelectorQuery().selectAll('.draw-line').fields({
          dataset: true,
          rect: true,
          size: true,
          scrollOffset: true
        }, res => {
          if (!res.length) {
            this.drawImageFunc(ctx, drawSuccess, false)
            return false
          }
          this.drawLine(res, ctx, 0, drawSuccess)
        }).exec()
      }).exec()
    },
    drawShadow: function (data, ctx) {
      if (!data || !data.boxShadow) {
        return false
      }
      const reg = /^[rR][gG][Bb][Aa]?[\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\.\d{1,2}|1|0)?[\)]{1}/gi
      const string = data.boxShadow.replace(/\s+/g, '')
      const regResult = reg.exec(string)
      if (regResult) {
        const color = regResult[0]
        const areaStr = string.replace(color, '')
        const areaArr = areaStr.split('px')
        ctx.save()
        ctx.shadowOffsetX = areaArr[0]
        ctx.shadowOffsetY = areaArr[1]
        ctx.shadowBlur = areaArr[2]
        ctx.shadowColor = color
      }
    },
    restoreShadow: function (ctx) {
      ctx.restore()
    },
    hasShadow: function (data) {
      if (!data || !data.boxShadow) {
        return false
      }
      const reg = /^[rR][gG][Bb][Aa]?[\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\.\d{1,2}|1|0)?[\)]{1}/gi
      const string = data.boxShadow.replace(/\s+/g, '')
      const regResult = reg.exec(string)
      if (regResult) {
        return regResult
      } else {
        return false
      }
    },
    canvasError: function (e) {
      let isCard = e.currentTarget.dataset.iscard
      this.setData({
        [isCard ? 'cardDrawing' : 'drawing']: false
      }, () => {
        this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing, cardDrawing: this.data.cardDrawing, canShareFriend: this.data.canShareFriend, canSharePengyouquan: this.data.canSharePengyouquan })
      })
    },
    drawLine: function (lineData, ctx, idx, drawSuccess, isCard) {
      ctx.save()
      ctx.moveTo(lineData[idx].left, lineData[idx].top)
      ctx.lineTo(lineData[idx].left + lineData[idx].width, lineData[idx].top)
      ctx.strokeStyle = lineData[idx].dataset.color || '#CFCFCF'
      ctx.stroke()
      ctx.restore()
      if ((idx + 1) == lineData.length) {
        this.drawImageFunc(ctx, drawSuccess, isCard)
      } else {
        this.drawLine(lineData, ctx, idx + 1, drawSuccess, isCard)
      }
    },
    drawImageFunc: function (ctx, drawSuccess, isCard) {
      const query = isCard ? '.draw-image-card' : '.draw-image'
      this.createSelectorQuery().selectAll(query).fields({
        dataset: true,
        rect: true,
        size: true,
        scrollOffset: true,
        properties: ['src'],
        computedStyle: ['borderRadius', 'boxShadow']
      }, res => {
        this.drawImage(res, ctx, 0, drawSuccess, isCard)
      }).exec()
    },
    drawImage: function (imageData, ctx, idx, drawSuccess, isCard) {
      wx.getImageInfo({
        src: imageData[idx].src,
        success: (res) => {
          if (this.hasShadow(imageData[idx])) {
            this.drawShadow(imageData[idx], ctx)
          }
          const img_width = res.width
          const img_height = res.height
          const draw_height = imageData[idx].height
          const draw_width = imageData[idx].width
          let clip_left, clip_top, clip_width, clip_height // 左偏移值，上偏移值，截取宽度，截取高度
          clip_height = img_width * (draw_height / draw_width)
          if (clip_height > img_height) {
            clip_height = img_height
            clip_width = clip_height * (draw_width / draw_height)
            clip_left = (img_width - clip_width) / 2
            clip_top = 0
          } else {
            clip_left = 0
            clip_top = (img_height - clip_height) / 2
            clip_width = img_width
          }
          let borderRadiusArr = imageData[idx].borderRadius.split(' ').map(item => {
            if (item.indexOf('px') !== -1) {
              return parseInt(item)
            } else if (item.indexOf('%') !== -1) {
              return imageData[idx].width * parseInt(item) / 100
            }
          })
          const hasRadius = borderRadiusArr.filter(item => item > 0).length > 0
          const banner_clip = { clip_left, clip_top, clip_width, clip_height }
          const {left, top, width, height} = imageData[idx]
          if (hasRadius) {
            if (borderRadiusArr && (borderRadiusArr.length == 1 || borderRadiusArr.length == 4)) { // 仅支持1个或4个参数的情况
              if (borderRadiusArr.length == 1) {
                borderRadiusArr = borderRadiusArr.concat(borderRadiusArr).concat(borderRadiusArr).concat(borderRadiusArr)
              }
              ctx.save()
              ctx.beginPath()
              ctx.moveTo(left, (top + borderRadiusArr[0]))
              ctx.arcTo(left, top, left + borderRadiusArr[0], top, borderRadiusArr[0])
              ctx.lineTo(left + width - borderRadiusArr[1], top)
              ctx.arcTo(left + width, top, (left + width), top + borderRadiusArr[1], borderRadiusArr[1])
              ctx.lineTo(left + width, top + height - borderRadiusArr[2])
              ctx.arcTo(left + width, top + height, (left + width - borderRadiusArr[2]), top + height, borderRadiusArr[2])
              ctx.lineTo(left + borderRadiusArr[3], top + height)
              ctx.arcTo(left, top + height, left, top + height - borderRadiusArr[3], borderRadiusArr[3])
              ctx.closePath()
              ctx.clip()
              ctx.drawImage(imageData[idx].dataset.islocal ? imageData[idx].src : res.path, banner_clip.clip_left, banner_clip.clip_top, banner_clip.clip_width, banner_clip.clip_height, imageData[idx].left, imageData[idx].top, imageData[idx].width, imageData[idx].height)
              ctx.restore()
            }
          } else {
            ctx.drawImage(imageData[idx].dataset.islocal ? imageData[idx].src : res.path, banner_clip.clip_left, banner_clip.clip_top, banner_clip.clip_width, banner_clip.clip_height, left, top, width, height)
          }
          if ((idx + 1) == imageData.length) {
            this.drawFillFunc(ctx, drawSuccess, isCard)
          } else {
            this.drawImage(imageData, ctx, idx + 1, drawSuccess, isCard)
          }
          if (this.hasShadow(imageData[idx])) {
            this.restoreShadow(ctx)
          }
        }
      })
    },
    drawFill: function (fillData, ctx, idx, drawSuccess, isCard) {
      let radius = {
        lt: 0,
        rt: 0,
        rb: 0,
        rl: 0
      }
      if (fillData[idx].borderRadius) {
        const radiusArr = fillData[idx].borderRadius.split(' ')
        radius.lt = parseInt(radiusArr[0])
        radius.rt = parseInt(radiusArr[1] || radiusArr[0])
        radius.rb = parseInt(radiusArr[2] || radiusArr[0])
        radius.lb= parseInt(radiusArr[3] || radiusArr[1] || radiusArr[0])
      }
      const x1 = fillData[idx].left + radius.lt
      const y1 = fillData[idx].top + radius.lt
      const r1 = radius.lt
      const sA1 = Math.PI
      const eA1 = 1.5 * Math.PI
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(fillData[idx].left, fillData[idx].top + r1)
      ctx.arc(x1, y1, r1, sA1, eA1)
      ctx.lineTo(fillData[idx].right - r1, fillData[idx].top)
      const x2 = fillData[idx].right - radius.rt
      const y2 = fillData[idx].top + radius.rt
      const r2 = radius.rt
      const sA2 = 1.5 * Math.PI
      const eA2 = 2 * Math.PI
      ctx.arc(x2, y2, r2, sA2, eA2)
      ctx.lineTo(fillData[idx].right, fillData[idx].bottom - r2)
      const x3 = fillData[idx].right - radius.rb
      const y3 = fillData[idx].bottom - radius.rb
      const r3 = radius.rb
      const sA3 = 0
      const eA3 = 0.5 * Math.PI
      ctx.arc(x3, y3, r3, sA3, eA3)
      ctx.lineTo(fillData[idx].left + r3, fillData[idx].bottom)
      const x4 = fillData[idx].left + radius.lb
      const y4 = fillData[idx].bottom - radius.lb
      const r4 = radius.lb
      const sA4 = 0.5 * Math.PI
      const eA4 = Math.PI
      ctx.arc(x4, y4, r4, sA4, eA4)
      ctx.lineTo(fillData[idx].left, fillData[idx].top + r4)
      ctx.fillStyle = fillData[idx].backgroundColor
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      if ((idx + 1) == fillData.length) {
        // ctx.draw(true, () => {
        //   this.drawStrokeFunc(ctx, drawSuccess)
        // })
        this.drawStrokeFunc(ctx, drawSuccess, isCard)
      } else {
        // ctx.draw(true, () => {
        //   this.drawFill(fillData, ctx, idx + 1, drawSuccess)
        // })
        this.drawFill(fillData, ctx, idx + 1, drawSuccess, isCard)
      }
    },
    drawStroke: function (strokeData, ctx, idx, drawSuccess, isCard) {
      let radius = {
        lt: 0,
        rt: 0,
        rb: 0,
        rl: 0
      }
      if (strokeData[idx].borderRadius) {
        const radiusArr = strokeData[idx].borderRadius.split(' ')
        radius.lt = parseInt(radiusArr[0])
        radius.rt = parseInt(radiusArr[1] || radiusArr[0])
        radius.rb = parseInt(radiusArr[2] || radiusArr[0])
        radius.lb = parseInt(radiusArr[3] || radiusArr[1] || radiusArr[0])
      }
      const x1 = strokeData[idx].left + radius.lt
      const y1 = strokeData[idx].top + radius.lt
      const r1 = radius.lt
      const sA1 = Math.PI
      const eA1 = 1.5 * Math.PI
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(strokeData[idx].left, strokeData[idx].top + r1)
      ctx.arc(x1, y1, r1, sA1, eA1)
      ctx.lineTo(strokeData[idx].right - r1, strokeData[idx].top)
      const x2 = strokeData[idx].right - radius.rt
      const y2 = strokeData[idx].top + radius.rt
      const r2 = radius.rt
      const sA2 = 1.5 * Math.PI
      const eA2 = 2 * Math.PI
      ctx.arc(x2, y2, r2, sA2, eA2)
      ctx.lineTo(strokeData[idx].right, strokeData[idx].bottom - r2)
      const x3 = strokeData[idx].right - radius.rb
      const y3 = strokeData[idx].bottom - radius.rb
      const r3 = radius.rb
      const sA3 = 0
      const eA3 = 0.5 * Math.PI
      ctx.arc(x3, y3, r3, sA3, eA3)
      ctx.lineTo(strokeData[idx].left + r3, strokeData[idx].bottom)
      const x4 = strokeData[idx].left + radius.lb
      const y4 = strokeData[idx].bottom - radius.lb
      const r4 = radius.lb
      const sA4 = 0.5 * Math.PI
      const eA4 = Math.PI
      ctx.arc(x4, y4, r4, sA4, eA4)
      ctx.lineTo(strokeData[idx].left, strokeData[idx].top + r4)
      ctx.strokeStyle = strokeData[idx].borderColor
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
      if ((idx + 1) == strokeData.length) {
        this.drawTextFunc(ctx, drawSuccess, isCard)
      } else {
        this.drawStroke(strokeData, ctx, idx + 1, drawSuccess, isCard)
      }
    },
    drawTextThroughLine: function (data, ctx, row = 0) {
      if (data.textDecoration && data.textDecoration.indexOf('line-through') !== -1) { // 存在line-through样式，则画删除线
        ctx.moveTo(data.left, data.top + parseInt(data.paddingTop) + parseInt(data.borderTopWidth) + parseInt(data.lineHeight) * (row + (1 / 2)))
        ctx.lineTo(data.left + ctx.measureText(data.dataset.text).width, data.top + parseInt(data.paddingTop) + parseInt(data.borderTopWidth) + parseInt(data.lineHeight) * (row + (1 / 2)))
        ctx.lineWidth = 1
        ctx.strokeStyle = data.color
        ctx.stroke()
      }
    },
    drawText: function (textData, ctx, idx, drawSuccess, isCard) {
      const alignObj = {start: 'left', center: 'center', end: 'right'}
      ctx.save()
      ctx.font = parseInt(textData[idx].fontSize) + 'px ' + textData[idx].fontFamily
      ctx.setTextAlign(alignObj[textData[idx].textAlign])
      ctx.setTextBaseline(textData[idx].dataset.baseline || 'middle')
      ctx.fillStyle = textData[idx].color
      if (textData[idx].dataset.maxline) {
        const maxLine = textData[idx].dataset.maxline
        const width = textData[idx].width
        let text = textData[idx].dataset.text
        let row = []
        let temp = ''
        for (let char of text) {
          if (char == '\n') {
            row.push(temp)
            temp = ''
          } else if (ctx.measureText(temp + char).width <= width) {
            temp += char
          } else {
            row.push(temp)
            temp = char
          }
        }
        row.push(temp)
        if (row[maxLine]) { // 表示超出最大行数
          row = row.filter((item, idx) => idx < maxLine)
          if (ctx.measureText(row[maxLine - 1] + '...').width > width) {
            row[maxLine - 1] = row[maxLine - 1].substring(0, row[maxLine - 1].length - 1) + '...'
          }
        }
        for (let b = 0; b < row.length; b++) {
          ctx.fillText(row[b], alignObj[textData[idx].textAlign] == 'center' ? (textData[idx].left + textData[idx].width / 2) : textData[idx].left + parseInt(textData[idx].paddingLeft) + parseInt(textData[idx].borderLeftWidth), textData[idx].top + parseInt(textData[idx].paddingTop) + parseInt(textData[idx].borderTopWidth) + parseInt(textData[idx].lineHeight) * (b + (1 / 2)), textData[idx].width)
          this.drawTextThroughLine(textData[idx], ctx, b)
        }
      } else {
        ctx.fillText(textData[idx].dataset.text, alignObj[textData[idx].textAlign] == 'center' ? (textData[idx].left + textData[idx].width / 2) : textData[idx].left + parseInt(textData[idx].paddingLeft) + parseInt(textData[idx].borderLeftWidth), textData[idx].top + parseInt(textData[idx].paddingTop) + parseInt(textData[idx].borderTopWidth) + parseInt(textData[idx].lineHeight) / 2, textData[idx].width)
        this.drawTextThroughLine(textData[idx], ctx, 0)
      }
      ctx.restore()
      this.textLen -= 1
      if ((idx + 1) == textData.length) {
        const query = isCard ? 'c-draw-poster-card' : 'c-draw-poster'
        ctx.draw(true, () => {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              canvasId: query,
              success: res => {
                this.createSelectorQuery().select('#top-wrapper').boundingClientRect(rect => {
                  if (rect) { // #top-wrapper有可能时隐藏状态的，所以做此判断
                    let _width = isCard ? this.cardPosterWidth : this.posterWidth
                    let _height = isCard ? this.cardPosterHeight : this.posterHeight
                    let width = 0
                    let height = 0
                    rect.height = rect.height - 44
                    const posterRatio = _width / _height
                    const topWrapperRatio = rect.width / rect.height
                    if (posterRatio < topWrapperRatio) {
                      height = rect.height * 0.88
                      width = height * posterRatio
                    } else {
                      width = rect.width * 0.88
                      height = width / posterRatio
                    }
                    this.setData({
                      posterWidth: width,
                      posterHeight: height
                    })
                  }
                }).exec()
                let localPoster = res.tempFilePath
                this.setData({
                  [isCard ? 'localCardPoster' : 'localPoster']: localPoster,
                  [isCard ? 'cardDrawing' : 'drawing']: false,
                  canSharePengyouquan: (!isCard && localPoster)
                }, () => {
                  this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing, cardDrawing: this.data.cardDrawing, canShareFriend: this.data.canShareFriend, canSharePengyouquan: this.data.canSharePengyouquan })
                  drawSuccess && drawSuccess()
                })
              },
              fail: res => {
                this.setData({
                  [isCard ? 'cardDrawing' : 'drawing']: false
                }, () => {
                  this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing, cardDrawing: this.data.cardDrawing, canShareFriend: this.data.canShareFriend, canSharePengyouquan: this.data.canSharePengyouquan })
                })
              }
            }, this)
          }, 200)
        })
      } else {
        this.drawText(textData, ctx, idx + 1, drawSuccess, isCard)
      }
    },
    drawFillFunc: function (ctx, drawSuccess, isCard) {
      const query = isCard ? '.draw-fill-card' : '.draw-fill'
      this.createSelectorQuery().selectAll(query).fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['borderRadius', 'backgroundColor', 'verticalAlign']
      }, res => {
        if (!res.length) {
          this.drawStrokeFunc(ctx, drawSuccess, isCard)
          return false
        }
        this.drawFill(res, ctx, 0, drawSuccess, isCard)
      }).exec()
    },
    drawStrokeFunc: function (ctx, drawSuccess, isCard) {
      const query = isCard ? '.draw-stroke-card' : '.draw-stroke'
      this.createSelectorQuery().selectAll(query).fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['borderRadius', 'borderColor']
      }, res => {
        if (!res.length) { // 不存在stroke类型时，直接跳过
          this.drawTextFunc(ctx, drawSuccess, isCard)
          return false
        }
        this.drawStroke(res, ctx, 0, drawSuccess, isCard)
      }).exec()
    },
    drawTextFunc: function (ctx, drawSuccess, isCard) {
      const query = isCard ? '.draw-text-card' : '.draw-text'
      this.createSelectorQuery().selectAll(query).fields({
        dataset: true,
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['fontSize', 'fontFamily', 'color', 'lineHeight', 'textAlign', 'paddingLeft', 'paddingTop', 'borderLeftWidth', 'borderTopWidth', 'textDecoration']
      }, res => {
        this.drawText(res, ctx, 0, drawSuccess, isCard)
      }).exec()
    },
    getPosterData: function (huodong_id, tuan_id, dataSuccess) { // dataSuccess在成功获取后执行
      const { fetching } = this.data
      if (fetching) { // 正在拉取数据
        return false
      }
      let rData = {
        id: huodong_id,
        tuan_id: tuan_id
      }
      this.setData({
        huodongId: huodong_id || '',
        tuanId: tuan_id || '',
        localPoster: '',
        localCardPoster: '',
        canShareFriend: false,
        canSharePengyouquan: false,
        fenxiao_price: '',
        fetching: true
      }, () => {
        this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing, cardDrawing: this.data.cardDrawing, canShareFriend: this.data.canShareFriend, canSharePengyouquan: this.data.canSharePengyouquan })
      })
      util.request('/product/share', rData).then(res => {
        if (res.data) {
          let data = res.data
          let _obj = {}
          _obj.saleType = data.sale_type
          _obj.uid = (data.user && data.user.id) ? data.user.id : ''
          _obj.hAvatar = (data.user && data.user.avatar) ? data.user.avatar : ''
          _obj.hName = (data.user && data.user.nick_name) ? data.user.nick_name : '我'
          _obj.hTip = (data.sale_type == 2 && tuan_id) ? '发起了拼团，邀请你参与拼团~' : '发现了一个宝贝，想要跟你分享~'
          _obj.sAvatar = (data.shop && data.shop.logo_url) ? data.shop.logo_url : ''
          _obj.banner = data.product_cover_url || data.cover_url
          _obj.title = data.title
          _obj.priceNum = data.price_num
          let price = ''
          if (data.sale_type == 1) { // 普通
            price = util.formatMoney(data.min_price).showMoney
          } else if (data.sale_type == 2) { // 拼团
            price = util.formatMoney(data.min_pt_price).showMoney
          } else if (data.sale_type == 3) { // 抢购
            price = util.formatMoney(data.min_qg_price).showMoney
          }
          _obj.price = price
          if (price) {
            const priceArr = price.split('.')
            _obj.priceFirst = priceArr[0] + '.'
            _obj.priceLast = priceArr[1] || '00'
          } else {
            _obj.priceFirst = '免费'
            _obj.priceLast = ''
          }
          _obj.originPrice = util.formatMoney(data.min_origin_price).showMoney
          _obj.reduce_amount = util.formatMoney(data.reduce_amount).showMoney
          _obj.fenxiao_price = data.fenxiao_price
          _obj.pintuan = data.spell_num
          _obj.joinNumber = data.join_num
          _obj.joinUsers = []
          if (data.tuan && data.tuan.tuanRecord && data.tuan.tuanRecord[0]) {
            let recordArr = [].concat(data.tuan.tuanRecord)
            let leftNum = data.spell_num - data.tuan.tuanRecord.length
            if (leftNum > 0) {
              for (let i = 0; i < leftNum; i++) {
                recordArr.push({ id: new Date().getTime() + i })
              }
            }
            _obj.joinUsers = recordArr
            _obj.leftNum = leftNum
          }
          _obj.qrcode = data.miniqr
          this.setData(_obj, dataSuccess)
        }
      }).catch(err => {

      }).finally(res => {
        this.setData({
          fetching: false
        }, () => {
          this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing, cardDrawing: this.data.cardDrawing, canShareFriend: this.data.canShareFriend, canSharePengyouquan: this.data.canSharePengyouquan })
        })
      })
    },
    startDraw: function (huodong_id, tuan_id, dontShowPoster) {
      if (!dontShowPoster) {
        this.showPoster()
      }
      const { huodongId, tuanId, localPoster, localCardPoster } = this.data
      if (huodong_id == huodongId && ((!tuan_id && !tuanId) || tuan_id == tuanId) && localPoster && localCardPoster) { // 之前已经画过
        return false
      }
      const dataSuccess = () => {
        // this.initShare()
        this.draw()
        this.drawCard(() => {
          this.initShare()
        })
      }
      this.getPosterData(huodong_id, tuan_id, dataSuccess)
    },
    startDrawAndSavePoster: function (huodong_id, tuan_id) {
      const { huodongId, tuanId, localPoster, localCardPoster } = this.data
      if (huodong_id == huodongId && ((!tuan_id && !tuanId) || tuan_id == tuanId) && localPoster && localCardPoster) { // 之前已经画过
        this.savePoster()
        this.initShare()
        return false
      }
      const dataSuccess = () => {
        this.draw(() => {
          this.savePoster()
        })
        this.drawCard(() => {
          this.initShare()
        })
      }
      this.getPosterData(huodong_id, tuan_id, dataSuccess)
    },
    showPoster: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
      this.initShare()
    },
    hidePoster: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
      this.recoverShare()
    },
    initShare: function () {
      const { title, huodongId, tuanId, fenxiao_price, uid, saleType, hName, localCardPoster } = this.data
      if (title && huodongId && localCardPoster) { // 存在数据
        let path = ''
        if (huodongId && tuanId) { // 分享团
          path += '/pages/pintuandetail/pintuandetail?id=' + tuanId
        } else if (huodongId && !tuanId) { // 分享商品
          path += '/pages/goodsdetail/goodsdetail?id=' + huodongId
        }
        if (fenxiao_price && uid) { // 有分销红利
          path += ('&uid=' + uid)
        }
        const pages = getCurrentPages()
        const page = pages[pages.length - 1]
        let passShareFunc = page.onShareAppMessage
        page._onShareAppMessage = passShareFunc
        page.onShareAppMessage = function () {
          return {
            title: `${hName}向你推荐：${title}`,
            path: path,
            imageUrl: localCardPoster
          }
        }
        this.setData({
          canShareFriend: true
        }, () => {
          this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing, cardDrawing: this.data.cardDrawing, canShareFriend: this.data.canShareFriend, canSharePengyouquan: this.data.canSharePengyouquan })
        })
      }
    },
    recoverShare: function () {
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      let passShareFunc = page._onShareAppMessage
      page.onShareAppMessage = passShareFunc
    },
    savePoster: function () {
      const {localPoster } = this.data
      if (!localPoster) {
        return false
      }
      // 获取用户是否开启用户授权相册
      const app = getApp()
      const confirmColor = app.globalData.themeModalConfirmColor || '#576B95' // #576B95是官方颜色
      wx.getSetting({
        success: res => {
          // 如果没有则获取授权
          if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] !== false) { // 未授权 且 未拒绝过
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                wx.saveImageToPhotosAlbum({
                  filePath: this.data.localPoster,
                  success: () => {
                    wx.showModal({
                      title: '保存成功',
                      content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                      showCancel: false,
                      confirmText: '确定',
                      confirmColor,
                      success: res => {
                        if (res.confirm) {
                          this.hidePoster()
                        }
                      }
                    })
                  },
                  fail: () => {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
              },
              fail: () => {

              }
            })
          } else if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] === false) { // 未授权且拒绝过
            wx.showModal({
              content: '保存图片需要你授权，请授权相册', //提示的内容
              showCancel: true,
              confirmText: '去授权',
              confirmColor,
              success: res => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      const authSetting = res.authSetting
                      if (authSetting['scope.writePhotosAlbum']) {
                        wx.saveImageToPhotosAlbum({
                          filePath: this.data.localPoster,
                          success: () => {
                            wx.showModal({
                              title: '保存成功',
                              content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                              showCancel: false,
                              confirmText: '确定',
                              confirmColor,
                              success: res => {
                                if (res.confirm) {
                                  this.hidePoster()
                                }
                              }
                            })
                          },
                          fail: () => {
                            wx.showToast({
                              title: '保存失败',
                              icon: 'none'
                            })
                          }
                        })
                      }
                    }
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (res.authSetting['scope.writePhotosAlbum']) {
            // 有则直接保存
            wx.saveImageToPhotosAlbum({
              filePath: this.data.localPoster,
              success: () => {
                wx.showModal({
                  title: '保存成功',
                  content: '海报已生成并保存至你的手机相册了哦，分享到朋友圈给好友种草一下吧',
                  showCancel: false,
                  confirmText: '确定',
                  confirmColor,
                  success: res => {
                    if (res.confirm) {
                      this.hidePoster()
                    }
                  }
                })
              },
              fail: () => {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },
    stopPropagation: function () {
      return false
    }
  }
})
