// components/drawPoster/drawPoster.js
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
    fetching: false,
    huodongId: '',
    tuanId: '',
    localPoster: '',
    showPoster: '',
    fenxiao_price: 0,
    canShareFriend: false,
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
    draw: function () {
      this.createSelectorQuery().select('#wrapper').boundingClientRect(rect => {
        const ctx = wx.createCanvasContext('c-draw-poster', this)
        ctx.setFillStyle('#FFFFFF')
        this.posterWidth = rect.width
        this.posterHeight = rect.height
        ctx.fillRect(0, 0, rect.width, rect.height)
        this.createSelectorQuery().selectAll('.draw-image').fields({
          dataset: true,
          rect: true,
          size: true,
          scrollOffset: true,
          properties: ['src'],
          computedStyle: ['borderRadius'],
        }, res => {
          this.imageLen = res.length
          res.forEach((item, idx) => {
            item.id      // 节点的ID
            item.dataset // 节点的dataset
            item.left    // 节点的左边界坐标
            item.right   // 节点的右边界坐标
            item.top     // 节点的上边界坐标
            item.bottom  // 节点的下边界坐标
            item.width   // 节点的宽度
            item.height  // 节点的高度
            this.drawImage(item, ctx)
          })
        }).exec()
      }).exec()
    },
    drawImage: function (imageData, ctx) {
      wx.getImageInfo({
        src: imageData.src,
        success: (res) => {
          // 按照aspectfill的方式截取
          const img_width = res.width
          const img_height = res.height
          const draw_height = imageData.height
          const draw_width = imageData.width
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
          const banner_clip = { clip_left, clip_top, clip_width, clip_height }
          if (parseInt(imageData.borderRadius) > 0) {
            ctx.save()
            ctx.beginPath()
            ctx.arc((imageData.left + (imageData.width / 2)), (imageData.top + (imageData.height / 2)), imageData.width / 2, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(imageData.dataset.islocal ? imageData.src : res.path, banner_clip.clip_left, banner_clip.clip_top, banner_clip.clip_width, banner_clip.clip_height, imageData.left, imageData.top, imageData.width, imageData.height)
            ctx.restore()
          } else {
            ctx.drawImage(imageData.dataset.islocal ? imageData.src : res.path, banner_clip.clip_left, banner_clip.clip_top, banner_clip.clip_width, banner_clip.clip_height, imageData.left, imageData.top, imageData.width, imageData.height)
          }
          this.imageLen -= 1
          if (this.imageLen < 1) {
            this.drawFillFunc(ctx)
          }
        }
      })
    },
    drawFill: function (fillData, ctx) {
      let radius = {
        lt: 0,
        rt: 0,
        rb: 0,
        rl: 0
      }
      if (fillData.borderRadius) {
        const radiusArr = fillData.borderRadius.split(' ')
        radius.lt = parseInt(radiusArr[0])
        radius.rt = parseInt(radiusArr[1] || radiusArr[0])
        radius.rb = parseInt(radiusArr[2] || radiusArr[0])
        radius.lb= parseInt(radiusArr[3] || radiusArr[1] || radiusArr[0])
      }
      const x1 = fillData.left + radius.lt
      const y1 = fillData.top + radius.lt
      const r1 = radius.lt
      const sA1 = Math.PI
      const eA1 = 1.5 * Math.PI
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(fillData.left, fillData.top + r1)
      ctx.arc(x1, y1, r1, sA1, eA1)
      ctx.lineTo(fillData.right - r1, fillData.top)
      const x2 = fillData.right - radius.rt
      const y2 = fillData.top + radius.rt
      const r2 = radius.rt
      const sA2 = 1.5 * Math.PI
      const eA2 = 2 * Math.PI
      ctx.arc(x2, y2, r2, sA2, eA2)
      ctx.lineTo(fillData.right, fillData.bottom - r2)
      const x3 = fillData.right - radius.rb
      const y3 = fillData.bottom - radius.rb
      const r3 = radius.rb
      const sA3 = 0
      const eA3 = 0.5 * Math.PI
      ctx.arc(x3, y3, r3, sA3, eA3)
      ctx.lineTo(fillData.left + r3, fillData.bottom)
      const x4 = fillData.left + radius.lb
      const y4 = fillData.bottom - radius.lb
      const r4 = radius.lb
      const sA4 = 0.5 * Math.PI
      const eA4 = Math.PI
      ctx.arc(x4, y4, r4, sA4, eA4)
      ctx.lineTo(fillData.left, fillData.top + r4)
      ctx.setFillStyle(fillData.backgroundColor)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      this.fillLen -= 1
      if (this.fillLen < 1) {
        this.drawStrokeFunc(ctx)
      }
    },
    drawStroke: function (strokeData, ctx) {
      let radius = {
        lt: 0,
        rt: 0,
        rb: 0,
        rl: 0
      }
      if (strokeData.borderRadius) {
        const radiusArr = strokeData.borderRadius.split(' ')
        radius.lt = parseInt(radiusArr[0])
        radius.rt = parseInt(radiusArr[1] || radiusArr[0])
        radius.rb = parseInt(radiusArr[2] || radiusArr[0])
        radius.lb = parseInt(radiusArr[3] || radiusArr[1] || radiusArr[0])
      }
      const x1 = strokeData.left + radius.lt
      const y1 = strokeData.top + radius.lt
      const r1 = radius.lt
      const sA1 = Math.PI
      const eA1 = 1.5 * Math.PI
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(strokeData.left, strokeData.top + r1)
      ctx.arc(x1, y1, r1, sA1, eA1)
      ctx.lineTo(strokeData.right - r1, strokeData.top)
      const x2 = strokeData.right - radius.rt
      const y2 = strokeData.top + radius.rt
      const r2 = radius.rt
      const sA2 = 1.5 * Math.PI
      const eA2 = 2 * Math.PI
      ctx.arc(x2, y2, r2, sA2, eA2)
      ctx.lineTo(strokeData.right, strokeData.bottom - r2)
      const x3 = strokeData.right - radius.rb
      const y3 = strokeData.bottom - radius.rb
      const r3 = radius.rb
      const sA3 = 0
      const eA3 = 0.5 * Math.PI
      ctx.arc(x3, y3, r3, sA3, eA3)
      ctx.lineTo(strokeData.left + r3, strokeData.bottom)
      const x4 = strokeData.left + radius.lb
      const y4 = strokeData.bottom - radius.lb
      const r4 = radius.lb
      const sA4 = 0.5 * Math.PI
      const eA4 = Math.PI
      ctx.arc(x4, y4, r4, sA4, eA4)
      ctx.lineTo(strokeData.left, strokeData.top + r4)
      ctx.setStrokeStyle(strokeData.borderColor)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
      this.strokeLen -= 1
      if (this.strokeLen < 1) {
        this.drawTextFunc(ctx)
      }
    },
    drawText: function (textData, ctx) {
      const alignObj = {start: 'left', center: 'center', end: 'right'}
      ctx.save()
      ctx.setFontSize(parseInt(textData.fontSize))
      ctx.setTextAlign(alignObj[textData.textAlign])
      ctx.setTextBaseline('middle')
      ctx.setFillStyle(textData.color)
      if (textData.dataset.maxline && textData.dataset.maxlength) {
        const chr = textData.dataset.text.split("")
        let temp = ""
        let _row = []
        for (let a = 0; a < chr.length; a++) {
          if (((temp + (chr[a])).length <= textData.dataset.maxlength)) { // 20个字算一行
            temp += chr[a]
          } else {
            _row.push(temp)
            temp = chr[a]
          }
        }
        _row.push(temp)
        let row = _row.filter((item, idx) => idx < 2)
        if (_row.length > textData.dataset.maxline) {
          row[row.length - 1] = row[row.length - 1].substring(0, textData.dataset.maxlength - 3) + '...'
        }
        for (var b = 0; b < row.length; b++) {
          ctx.fillText(row[b], textData.left + parseInt(textData.paddingLeft) + parseInt(textData.borderLeftWidth), textData.top + parseInt(textData.paddingTop) + parseInt(textData.borderTopWidth) + parseInt(textData.lineHeight) * (b + (1 / 2)), textData.width)
        }
      } else {
        ctx.fillText(textData.dataset.text, textData.left + parseInt(textData.paddingLeft) + parseInt(textData.borderLeftWidth), textData.top + parseInt(textData.paddingTop) + parseInt(textData.borderTopWidth) + parseInt(textData.lineHeight) / 2, textData.width)
      }
      ctx.restore()
      this.textLen -= 1
      if (this.textLen < 1) {
        ctx.draw(true, () => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'c-draw-poster',
            success: res => {
              const query = this.createSelectorQuery().select('#top-wrapper').boundingClientRect(rect => {
                let width = 0
                let height = 0
                const posterRatio = this.posterWidth / this.posterHeight
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
              }).exec()
              let localPoster = res.tempFilePath
              this.setData({
                localPoster: localPoster
              })
            },
            fail: res => {
              console.log('fail_res', res)
            }
          }, this)
        })
      }
    },
    drawFillFunc: function (ctx) {
      this.createSelectorQuery().selectAll('.draw-fill').fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['borderRadius', 'backgroundColor']
      }, res => {
        this.fillLen = res.length
        res.forEach((item, idx) => {
          item.id      // 节点的ID
          item.dataset // 节点的dataset
          item.left    // 节点的左边界坐标
          item.right   // 节点的右边界坐标
          item.top     // 节点的上边界坐标
          item.bottom  // 节点的下边界坐标
          item.width   // 节点的宽度
          item.height  // 节点的高度
          this.drawFill(item, ctx)
        })
      }).exec()
    },
    drawStrokeFunc: function (ctx) {
      this.createSelectorQuery().selectAll('.draw-stroke').fields({
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['borderRadius', 'borderColor']
      }, res => {
        this.strokeLen = res.length
        if (!res.length) { // 不存在stroke类型，直接跳过
          this.drawTextFunc(ctx)
          return false
        }
        res.forEach((item, idx) => {
          item.id      // 节点的ID
          item.dataset // 节点的dataset
          item.left    // 节点的左边界坐标
          item.right   // 节点的右边界坐标
          item.top     // 节点的上边界坐标
          item.bottom  // 节点的下边界坐标
          item.width   // 节点的宽度
          item.height  // 节点的高度
          this.drawStroke(item, ctx)
        })
      }).exec()
    },
    drawTextFunc: function (ctx) {
      this.createSelectorQuery().selectAll('.draw-text').fields({
        dataset: true,
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: ['fontSize', 'color', 'lineHeight', 'textAlign', 'paddingLeft', 'paddingTop', 'borderLeftWidth', 'borderTopWidth'],
      }, res => {
        this.textLen = res.length
        res.forEach((item, idx) => {
          item.id      // 节点的ID
          item.dataset // 节点的dataset
          item.left    // 节点的左边界坐标
          item.right   // 节点的右边界坐标
          item.top     // 节点的上边界坐标
          item.bottom  // 节点的下边界坐标
          item.width   // 节点的宽度
          item.height  // 节点的高度
          this.drawText(item, ctx)
        })
      }).exec()
    },
    startDraw: function (huodong_id, tuan_id) {
      this.showPoster()
      const { huodongId, tuanId, localPoster, fetching} = this.data
      if ((huodong_id == huodongId && tuan_id == tuan_id && localPoster) || fetching) { // 之前已经画过
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
      })
      util.request('/huodong/share', rData).then(res => {
        if (res.data) {
          let data = res.data
          let _obj = {}
          _obj.uid = data.user.id
          _obj.hAvatar = data.user.avatar
          _obj.hName = data.user.nick_name
          _obj.hTip = '发起了拼团，邀请你参与拼团~'
          _obj.banner = data.cover_url
          _obj.title = data.title
          _obj.price = util.formatMoney(data.saletype == 1 ? data.min_price : data.min_pt_price).showMoney
          _obj.fenxiao_price = util.formatMoney(data.fenxiao_price).showMoney
          _obj.pintuan = data.spell_num
          _obj.joinNumber = data.join_num
          _obj.joinUsers = []
          if (data.tuan && data.tuan.tuanRecord && data.tuan.tuanRecord[0]) {
            let recordArr = [].concat(data.tuan.tuanRecord)
            let leftNum = data.spell_num - data.tuan.tuanRecord.length
            if (leftNum > 0) {
              for (let i = 0; i < leftNum; i++) {
                recordArr.push({id: new Date().getTime() + i})
              }
            }
            _obj.joinUsers = recordArr
            _obj.leftNum = leftNum
          }
          _obj.qrcode = data.miniqr
          this.setData(_obj, () => {
            this.initShare()
            this.draw()
          })
        }
      }).catch(err => {

      }).finally(res => {
        this.setData({
          fetching: false
        })
      })
    },
    showPoster: function () {
      this.setData({
        showPoster: 2
      })
      this.initShare()
    },
    hidePoster: function () {
      this.setData({
        showPoster: 1
      })
      this.recoverShare()
    },
    initShare: function () {
      const { title, banner, huodongId, tuanId, fenxiao_price, uid } = this.data
      if (title && banner && huodongId) { // 存在数据
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
            title: title,
            path: path,
            imageUrl: banner
          }
        }
        this.setData({
          canShareFriend: true
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
                      confirmColor: confirmColor
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
                              confirmColor
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
                  confirmColor
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
