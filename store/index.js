import Store from '../miniprogram_npm/wxministore/index.js'

module.exports = new Store({
  state: {
    permission: {},
    showRelaunchHome: {},
    openPart: true
  },
  methods: {
    openConfirmCode: function (e) {
      const pages = getCurrentPages()
      const page = pages[pages.length -1]
      const confirmCode = page.selectComponent('#confirm-code')
      if (confirmCode) {
        confirmCode.open(e)
      }
    },
    closeConfirmCode: function () {
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      const confirmCode = page.selectComponent('#confirm-code')
      if (confirmCode) {
        confirmCode.close()
      }
    }
  }
})