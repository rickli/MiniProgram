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
        
        const newRecord = {
          id: Date.now(),
          time,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        }

        // 保存记录
        const records = wx.getStorageSync('PUNCH_RECORDS') || []
        records.unshift(newRecord)
        wx.setStorageSync('PUNCH_RECORDS', records)

        wx.showToast({
          title: '打卡成功',
          icon: 'success'
        })

        this.setData({
          lastRecord: newRecord,
          loading: false
        })
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
