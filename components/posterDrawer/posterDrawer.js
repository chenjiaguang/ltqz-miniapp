// components/posterDrawer/posterDrawer.js
import util from '../../utils/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    fetching: false, // 是否正在拉取数据
    drawing: false, // 是否正在画图
    localPoster: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    draw: function (drawSuccess) { // drawSuccess在生成图片成功时会回调，并传入图片临时地址
      console.log('draw')
      this.setData({
        drawing: true
      }, () => {
        this.triggerEvent('statuschange', {
          fetching: this.data.fetching,
          drawing: this.data.drawing
        })
      })
      this.createSelectorQuery().select('#wrapper').boundingClientRect(rect => {
        const ctx = wx.createCanvasContext('draw-canvas', this)
        ctx.setFillStyle('#FFFFFF')
        this.posterWidth = rect.width
        this.posterHeight = rect.height
        ctx.fillRect(0, 0, rect.width, rect.height) // 画白色背景
        this.createSelectorQuery().selectAll('.draw-image').fields({
          dataset: true,
          rect: true,
          size: true,
          scrollOffset: true,
          properties: ['src'],
          computedStyle: ['borderRadius'],
        }, res => {
          this.drawImage(res, ctx, 0, drawSuccess)
        }).exec()
      }).exec()
    },
    canvasError: function () {
      console.log('canvasError')
      this.setData({
        drawing: false
      }, () => {
        this.triggerEvent('statuschange', {
          fetching: this.data.fetching,
          drawing: this.data.drawing
        })
      })
    },
    drawImage: function (imageData, ctx, idx, drawSuccess) {
      wx.getImageInfo({
        src: imageData[idx].src,
        success: (res) => {
          // 按照aspectfill的方式截取
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
          const banner_clip = {
            clip_left,
            clip_top,
            clip_width,
            clip_height
          }
          if (parseInt(imageData[idx].borderRadius) > 0) {
            ctx.save()
            ctx.beginPath()
            ctx.arc((imageData[idx].left + (imageData[idx].width / 2)), (imageData[idx].top + (imageData[idx].height / 2)), imageData[idx].width / 2, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(imageData[idx].dataset.islocal ? imageData[idx].src : res.path, banner_clip.clip_left, banner_clip.clip_top, banner_clip.clip_width, banner_clip.clip_height, imageData[idx].left, imageData[idx].top, imageData[idx].width, imageData[idx].height)
            ctx.restore()
          } else {
            ctx.drawImage(imageData[idx].dataset.islocal ? imageData[idx].src : res.path, banner_clip.clip_left, banner_clip.clip_top, banner_clip.clip_width, banner_clip.clip_height, imageData[idx].left, imageData[idx].top, imageData[idx].width, imageData[idx].height)
          }
          if ((idx + 1) == imageData.length) {
            this.drawFillFunc(ctx, drawSuccess)
          } else {
            this.drawImage(imageData, ctx, idx + 1, drawSuccess)
          }
        }
      })
    },
    drawFill: function (fillData, ctx, idx, drawSuccess) {
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
        radius.lb = parseInt(radiusArr[3] || radiusArr[1] || radiusArr[0])
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
      ctx.setFillStyle(fillData[idx].backgroundColor)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      this.fillLen -= 1
      if ((idx + 1) == fillData.length) {
        this.drawStrokeFunc(ctx, drawSuccess)
      } else {
        this.drawFill(fillData, ctx, idx + 1, drawSuccess)
      }
    },
    drawStroke: function (strokeData, ctx, idx, drawSuccess) {
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
      let pos = 0
      if (strokeData[idx].borderWidth) {
        pos = parseInt(strokeData[idx].borderWidth) / 2
        ctx.setLineWidth(parseInt(strokeData[idx].borderWidth))
      }
      const x1 = strokeData[idx].left + radius.lt + pos
      const y1 = strokeData[idx].top + radius.lt + pos
      const r1 = radius.lt
      const sA1 = Math.PI
      const eA1 = 1.5 * Math.PI
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(strokeData[idx].left + pos, strokeData[idx].top + r1 + pos)
      ctx.arc(x1, y1, r1, sA1, eA1)
      ctx.lineTo(strokeData[idx].right - r1 - pos, strokeData[idx].top + pos)
      const x2 = strokeData[idx].right - radius.rt - pos
      const y2 = strokeData[idx].top + radius.rt + pos
      const r2 = radius.rt
      const sA2 = 1.5 * Math.PI
      const eA2 = 2 * Math.PI
      ctx.arc(x2, y2, r2, sA2, eA2)
      ctx.lineTo(strokeData[idx].right - pos, strokeData[idx].bottom - r2 - pos)
      const x3 = strokeData[idx].right - radius.rb - pos
      const y3 = strokeData[idx].bottom - radius.rb - pos
      const r3 = radius.rb
      const sA3 = 0
      const eA3 = 0.5 * Math.PI
      ctx.arc(x3, y3, r3, sA3, eA3)
      ctx.lineTo(strokeData[idx].left + r3 + pos, strokeData[idx].bottom - pos)
      const x4 = strokeData[idx].left + radius.lb + pos
      const y4 = strokeData[idx].bottom - radius.lb - pos
      const r4 = radius.lb
      const sA4 = 0.5 * Math.PI
      const eA4 = Math.PI
      ctx.arc(x4, y4, r4, sA4, eA4)
      ctx.lineTo(strokeData[idx].left + pos, strokeData[idx].top + r4 - pos)
      ctx.setStrokeStyle(strokeData[idx].borderColor)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
      this.strokeLen -= 1
      if ((idx + 1) == strokeData.length) {
        this.drawTextFunc(ctx, drawSuccess)
      } else {
        this.drawStroke(strokeData, ctx, idx + 1, drawSuccess)
      }
    },
    drawText: function (ctx, textData, textDrawed) {
      const alignObj = {
        start: 'left',
        center: 'center',
        end: 'right'
      }
      ctx.save()
      ctx.setFontSize(textData.fontSize)
      ctx.setTextAlign(alignObj[textData.textAlign])
      ctx.setTextBaseline('middle')
      ctx.setFillStyle(textData.color)
      if (textData.dataset.maxline && textData.dataset.maxlength) {
        const chr = textData.dataset.text.split("")
        let temp = ""
        let _row = []
        for (let a = 0; a < chr.length; a++) {
          if (((temp + (chr[a])).length <= textData.dataset.maxlength)) {
            temp += chr[a]
          } else {
            _row.push(temp)
            temp = chr[a]
          }
        }
        _row.push(temp)
        let row = _row.filter((item, _idx) => _idx < textData.dataset.maxline)
        if (_row.length >= textData.dataset.maxline && _row[row.length - 1].length >= textData.dataset.maxlength) {
          row[row.length - 1] = row[row.length - 1].substring(0, textData.dataset.maxlength - 1) + '...'
        }
        for (let b = 0; b < row.length; b++) {
          ctx.fillText(row[b], alignObj[textData.textAlign] == 'center' ? (textData.left + textData.width / 2) : textData.left + textData.paddingLeft + textData.borderLeftWidth, textData.top + textData.paddingTop + textData.borderTopWidth + textData.lineHeight * (b + (1 / 2)), textData.width)
        }
        console.log('row', row)
      } else {
        console.log('not_row')
        ctx.fillText(textData.dataset.text, alignObj[textData.textAlign] == 'center' ? (textData.left + textData.width / 2) : textData.left + textData.paddingLeft + textData.borderLeftWidth, textData.top + textData.paddingTop + textData.borderTopWidth + textData.lineHeight / 2, textData.width)
      }
      ctx.restore()
      textDrawed()
    },
    drawFillFunc: function (ctx, drawSuccess) {
      this.createSelectorQuery().selectAll('.draw-fill').fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['borderRadius', 'backgroundColor']
      }, res => {
        if (!res.length) { // 不存在stroke类型时，直接跳过
          this.drawStrokeFunc(ctx, drawSuccess)
          return false
        }
        this.drawFill(res, ctx, 0, drawSuccess)
      }).exec()
    },
    drawStrokeFunc: function (ctx, drawSuccess) {
      this.createSelectorQuery().selectAll('.draw-stroke').fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['borderRadius', 'borderColor', 'borderWidth']
      }, res => {
        if (!res.length) { // 不存在stroke类型时，直接跳过
          this.drawTextFunc(ctx, drawSuccess)
          return false
        }
        this.drawStroke(res, ctx, 0, drawSuccess)
      }).exec()
    },
    drawTextFunc: function (ctx, drawSuccess) {
      this.createSelectorQuery().selectAll('.draw-text').fields({
        dataset: true,
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['fontSize', 'color', 'lineHeight', 'textAlign', 'paddingLeft', 'paddingTop', 'borderLeftWidth', 'borderTopWidth'],
      }, res => {
        this.drawText(res, ctx, 0, drawSuccess)
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
        canShareFriend: false,
        fetching: true
      }, () => {
        this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing })
      })
      util.request('/huodong/share', rData).then(res => {
        if (res.data) {
          let data = res.data
          let _obj = {}
          _obj.saleType = data.sale_type
          _obj.uid = data.user.id
          _obj.hAvatar = data.user.avatar
          _obj.hName = data.user.nick_name
          _obj.hTip = (data.sale_type == 2 && tuan_id) ? '发起了拼团，邀请你参与拼团~' : '发现了一个宝贝，想要跟你分享~'
          _obj.banner = data.cover_url
          _obj.title = data.title
          _obj.price = util.formatMoney(data.sale_type == 1 ? data.min_price : data.min_pt_price).showMoney
          _obj.fenxiao_price = util.formatMoney(data.fenxiao_price).showMoney
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
          console.log('ddff')
          this.setData(_obj, dataSuccess)
        }
      }).catch(err => {

      }).finally(res => {
        this.setData({
          fetching: false
        }, () => {
          this.triggerEvent('statuschange', { fetching: this.data.fetching, drawing: this.data.drawing })
        })
      })
    },
    elementSort: function (arr) { // 根据dataset.order大小来排序
      return arr.sort(function (ele1, ele2) {
        return ele1.dataset.order - ele2.dataset.order
      })
    },
    drawElements: function (ctx, eles, idx, drawEnd) {
      const {type, text} = eles[idx].dataset
      console.log('drawElements', eles, idx, type, text)
      let nextFunc = null
      if (idx == eles.length - 1) {
        console.log('ddd')
        nextFunc = () => {
          drawEnd(ctx)
        }
      } else {
        console.log('eee')
        nextFunc = () => {
          this.drawElements(ctx, eles, idx + 1, drawEnd)
        }
      }
      if (type == 'text') { // 画文字
        console.log('text')
        this.drawText(ctx, eles[idx], nextFunc)
      } else if (type == 'image') { // 画图片
        console.log('image')
      }
    },
    elementsDrawEnd: function (ctx) {
      console.log('elementsDrawEnd')
      ctx.draw(true, () => {

      })
    },
    startDraw: function (page, huodong_id, tuan_id) {
      console.log('startDraw')
      if (this.data.drawing) {
        return false
      }
      this.drawing = true
      this.triggerEvent('statuschange', {
        drawing: this.drawing
      })
      this.createSelectorQuery().select('#wrapper').boundingClientRect(rect => {
        const ctx = wx.createCanvasContext('draw-canvas', this)
        this.posterWidth = rect.width
        this.posterHeight = rect.height
        ctx.clearRect(0, 0, rect.width, rect.height) // 清空canvas
        ctx.setFillStyle('pink')
        ctx.fillRect(0, 0, rect.width, rect.height) // 画白色背景
        page.createSelectorQuery().selectAll('.draw-ele').fields({
          dataset: true,
          rect: true,
          size: true,
          scrollOffset: true,
          properties: ['src'],
          computedStyle: ['borderWidth', 'borderColor', 'borderRadius', 'fontSize', 'color', 'lineHeight', 'textAlign', 'paddingLeft', 'paddingTop', 'borderLeftWidth', 'borderTopWidth', 'backgroundColor']
        }, res => {
          if (res && res.length) {
            const eles = this.elementSort(res).map(item => {
              return Object.assign({}, item, { fontSize: parseInt(item.fontSize), borderLeftWidth: parseInt(item.borderLeftWidth), borderTopWidth: parseInt(item.borderTopWidth), borderRadius: parseInt(item.borderRadius), borderWidth: parseInt(item.borderWidth), lineHeight: parseInt(item.lineHeight) || parseInt(item.fontSize) * 1.5, paddingLeft: parseInt(item.paddingLeft), paddingTop: parseInt(item.paddingTop)})
            })
            this.drawElements(ctx, eles, 0, this.elementsDrawEnd)
          } else {
            this.drawing = false
            this.triggerEvent('statuschange', {
              drawing: this.drawing
            })
          }
        }).exec()
        // this.createSelectorQuery().selectAll('.draw-image').fields({
        //   dataset: true,
        //   rect: true,
        //   size: true,
        //   scrollOffset: true,
        //   properties: ['src'],
        //   computedStyle: ['borderRadius'],
        // }, res => {
        //   this.drawImage(res, ctx, 0, drawSuccess)
        // }).exec()
      }).exec()
    },
    showPoster: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
    },
    hidePoster: function () {
      const ftModal = this.selectComponent('#c-ft-modal')
      ftModal && ftModal.toggle && ftModal.toggle()
    },
    stopPropagation: function () {
      return false
    }
  }
})