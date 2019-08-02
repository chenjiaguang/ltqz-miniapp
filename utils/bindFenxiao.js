import storageHelper from './storageHelper.js'

module.exports = {
  saveFenxiaoId: (id) => {
    storageHelper.setStorage('fenxiaoid_unbind', id)
  }
}