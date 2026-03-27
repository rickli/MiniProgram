// pages/index/index.js
const util = require('../../utils/util.js')

Page({
  data: {
    loading: false,
    lastRecord: null
  },

  onShow() {
    this.getLastRecord()
  },

  getLastRecord() {
    const records = wx.getStorageSync('PUNCH_RECORDS') || []
    if (records.length > 0) {
      this.setData({
        lastRecord: records[0]
      })
    }
  },

  handlePunchIn() {
    this.setData({ loading: true })
    
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res
        const time = util.formatTime(new Date())
        
        // 跳转到详情页，携带基础参数
        wx.navigateTo({
          url: `/pages/detail/detail?time=${time}&lat=${latitude}&lon=${longitude}`
        })

        this.setData({ loading: false })
      },
      fail: (err) => {
        console.error('获取位置失败', err)
        wx.showModal({
          title: '打卡失败',
          content: '请确保已开启定位权限并重试',
          showCancel: false
        })
        this.setData({ loading: false })
      }
    })
  }
})
