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
    photos: [],
    presetTags: ['工作', '生活', '旅行'],
    selectedTags: []
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
  toggleTag(e) {
    const { tag } = e.currentTarget.dataset
    let { selectedTags } = this.data
    const index = selectedTags.indexOf(tag)
    if (index > -1) {
      selectedTags.splice(index, 1)
    } else {
      selectedTags.push(tag)
    }
    this.setData({ selectedTags })
  },
  handleSave() {
    const { record, selectedMood, note, photos, selectedTags } = this.data
    const newRecord = {
      ...record,
      id: Date.now(),
      mood: selectedMood,
      note,
      photos,
      tags: selectedTags
    }

    const records = wx.getStorageSync('PUNCH_RECORDS') || []
    records.unshift(newRecord)
    wx.setStorageSync('PUNCH_RECORDS', records)

    wx.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/me/me' })
    }, 1500)
  }
})
