Page({
  data: {
    record: {
      time: '',
      address: '',
      latitude: '',
      longitude: ''
    },
    moods: ['😊', '😢', '💼', '🏖️', '🔥'],
    selectedMood: '😊',
    note: '',
    photos: []
  },
  onLoad(options) {
    const { time, lat, lon } = options
    this.setData({
      'record.time': time,
      'record.latitude': lat,
      'record.longitude': lon
    })
  },
  selectMood(e) {
    this.setData({
      selectedMood: e.currentTarget.dataset.mood
    })
  },
  onNoteInput(e) {
    this.setData({ note: e.detail.value })
  },
  chooseImage() {
    wx.chooseMedia({
      count: 3 - this.data.photos.length,
      mediaType: ['image'],
      success: (res) => {
        const newPhotos = res.tempFiles.map(file => file.tempFilePath)
        this.setData({
          photos: [...this.data.photos, ...newPhotos]
        })
      }
    })
  },
  deletePhoto(e) {
    const { index } = e.currentTarget.dataset
    const photos = [...this.data.photos]
    photos.splice(index, 1)
    this.setData({ photos })
  },
  previewImage(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      current: url,
      urls: this.data.photos
    })
  },
  handleSave() {
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/me/me' })
    }, 1500)
  }
})
