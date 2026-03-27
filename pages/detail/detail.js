Page({
  data: {
    record: {
      time: '',
      address: '',
      latitude: '',
      longitude: ''
    }
  },
  onLoad(options) {
    const { time, lat, lon } = options
    this.setData({
      'record.time': time,
      'record.latitude': lat,
      'record.longitude': lon
    })
  },
  handleSave() {
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/me/me' })
    }, 1500)
  }
})
