// pages/me/me.js
Page({
  data: {
    records: []
  },

  onShow() {
    this.loadRecords()
  },

  loadRecords() {
    const records = wx.getStorageSync('PUNCH_RECORDS') || []
    this.setData({
      records
    })
  },

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset
    wx.previewImage({
      current,
      urls
    })
  }
})
