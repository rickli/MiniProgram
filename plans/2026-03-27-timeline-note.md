# Timeline Note Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在打卡功能基础上增加笔记、心情、图片和标签功能，并以时间线形式展示记录。

**Architecture:** 
- 采用“打卡 -> 详情编辑 -> 列表展示”的流转模式。
- 详情页负责收集多维度数据（心情、笔记、图片、标签）。
- 列表页（原“我的”页面）重构为标准时间线布局。
- 数据持久化存储在本地 `PUNCH_RECORDS` 缓存中。

**Tech Stack:** 微信小程序原生框架 (WXML, WXSS, JS), `wx.getLocation`, `wx.chooseMedia`, `wx.setStorageSync`。

---

### Task 1: 创建详情编辑页基础结构

**Files:**
- Create: `pages/detail/detail.wxml`
- Create: `pages/detail/detail.js`
- Create: `pages/detail/detail.json`
- Create: `pages/detail/detail.wxss`
- Modify: `app.json`

- [ ] **Step 1: 在 app.json 中注册新页面**

Modify: `app.json`
```json
{
  "pages": [
    "pages/index/index",
    "pages/me/me",
    "pages/detail/detail"
  ],
  ...
}
```

- [ ] **Step 2: 编写页面基础配置**

Create: `pages/detail/detail.json`
```json
{
  "navigationBarTitleText": "编辑记录"
}
```

- [ ] **Step 3: 编写页面基础结构 (WXML)**

Create: `pages/detail/detail.wxml`
```xml
<view class="container">
  <!-- 只读信息区 -->
  <view class="section info-card">
    <view class="info-item">
      <text class="label">时间</text>
      <text class="value">{{record.time}}</text>
    </view>
    <view class="info-item">
      <text class="label">地点</text>
      <text class="value address">{{record.address || '正在获取地址...'}}</text>
    </view>
  </view>

  <!-- 保存按钮 -->
  <view class="footer">
    <button class="save-btn" type="primary" bindtap="handleSave">保存记录</button>
  </view>
</view>
```

- [ ] **Step 4: 编写页面基础逻辑 (JS)**

Create: `pages/detail/detail.js`
```javascript
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
    setTimeout(() => wx.switchTab({ url: '/pages/me/me' }), 1500)
  }
})
```

- [ ] **Step 5: 提交代码**

```bash
git add app.json pages/detail/
git commit -m "feat: init detail page structure"
```

---

### Task 2: 实现心情选择功能

**Files:**
- Modify: `pages/detail/detail.wxml`
- Modify: `pages/detail/detail.js`
- Modify: `pages/detail/detail.wxss`

- [ ] **Step 1: 在 WXML 中添加心情选择器**

Modify: `pages/detail/detail.wxml` (在 info-card 后添加)
```xml
<view class="section">
  <view class="section-title">此刻心情</view>
  <view class="mood-list">
    <view 
      wx:for="{{moods}}" 
      wx:key="index" 
      class="mood-item {{selectedMood === item ? 'active' : ''}}" 
      bindtap="selectMood" 
      data-mood="{{item}}"
    >
      {{item}}
    </view>
  </view>
</view>
```

- [ ] **Step 2: 在 JS 中添加数据和方法**

Modify: `pages/detail/detail.js`
```javascript
Page({
  data: {
    moods: ['😊', '😢', '💼', '🏖️', '🔥'],
    selectedMood: '😊',
    ...
  },
  selectMood(e) {
    this.setData({
      selectedMood: e.currentTarget.dataset.mood
    })
  },
  ...
})
```

- [ ] **Step 3: 编写心情选择样式 (关键：正圆形选中效果)**

Create: `pages/detail/detail.wxss`
```css
.section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
}
.section-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}
.mood-list {
  display: flex;
  justify-content: space-between;
}
.mood-item {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  border: 4rpx solid transparent;
  border-radius: 50%; /* 确保是圆形 */
  transition: all 0.3s;
}
.mood-item.active {
  border-color: #07c160;
}
```

- [ ] **Step 4: 提交代码**

```bash
git add pages/detail/
git commit -m "feat: add mood picker with circular active state"
```

---

### Task 3: 实现文字笔记与图片上传

**Files:**
- Modify: `pages/detail/detail.wxml`
- Modify: `pages/detail/detail.js`
- Modify: `pages/detail/detail.wxss`

- [ ] **Step 1: 添加笔记输入框和图片上传 UI**

Modify: `pages/detail/detail.wxml`
```xml
<!-- 文字笔记 -->
<view class="section">
  <view class="section-title">笔记内容</view>
  <textarea 
    class="note-input" 
    placeholder="记录这一刻的想法..." 
    bindinput="onNoteInput"
    maxlength="500"
  ></textarea>
</view>

<!-- 图片上传 -->
<view class="section">
  <view class="section-title">添加照片 (最多3张)</view>
  <view class="photo-list">
    <view class="photo-item" wx:for="{{photos}}" wx:key="*this">
      <image src="{{item}}" mode="aspectFill" bindtap="previewImage" data-url="{{item}}"></image>
      <view class="delete-btn" bindtap="deletePhoto" data-index="{{index}}">×</view>
    </view>
    <view class="upload-btn" bindtap="chooseImage" wx:if="{{photos.length < 3}}">+</view>
  </view>
</view>
```

- [ ] **Step 2: 在 JS 中处理输入和上传逻辑**

Modify: `pages/detail/detail.js`
```javascript
Page({
  data: {
    note: '',
    photos: [],
    ...
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
  ...
})
```

- [ ] **Step 3: 补充样式**

Modify: `pages/detail/detail.wxss`
```css
.note-input {
  width: 100%;
  height: 200rpx;
  font-size: 28rpx;
}
.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.photo-item, .upload-btn {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  background: #f0f0f0;
}
.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  color: #999;
  border: 1rpx dashed #ccc;
}
.photo-item {
  position: relative;
}
.photo-item image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}
.delete-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}
```

- [ ] **Step 4: 提交代码**

```bash
git add pages/detail/
git commit -m "feat: add note input and image upload"
```

---

### Task 4: 实现标签系统与保存逻辑

**Files:**
- Modify: `pages/detail/detail.wxml`
- Modify: `pages/detail/detail.js`
- Modify: `pages/detail/detail.wxss`

- [ ] **Step 1: 添加标签系统 UI**

Modify: `pages/detail/detail.wxml`
```xml
<view class="section">
  <view class="section-title">标签</view>
  <view class="tag-list">
    <view 
      wx:for="{{presetTags}}" 
      wx:key="*this"
      class="tag-item {{selectedTags.includes(item) ? 'active' : ''}}"
      bindtap="toggleTag"
      data-tag="{{item}}"
    >
      #{{item}}
    </view>
  </view>
</view>
```

- [ ] **Step 2: 在 JS 中完善标签逻辑与持久化保存**

Modify: `pages/detail/detail.js`
```javascript
Page({
  data: {
    presetTags: ['工作', '生活', '旅行'],
    selectedTags: [],
    ...
  },
  toggleTag(e) {
    const { tag } = e.currentTarget.dataset
    let { selectedTags } = this.data
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag)
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
```

- [ ] **Step 3: 补充标签样式**

Modify: `pages/detail/detail.wxss`
```css
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.tag-item {
  padding: 8rpx 24rpx;
  background: #f3f3f3;
  color: #666;
  border-radius: 30rpx;
  font-size: 24rpx;
}
.tag-item.active {
  background: #e1f5fe;
  color: #0288d1;
}
```

- [ ] **Step 4: 提交代码**

```bash
git add pages/detail/
git commit -m "feat: add tag system and data persistence"
```

---

### Task 5: 首页打卡后自动跳转

**Files:**
- Modify: `pages/index/index.js`

- [ ] **Step 1: 修改打卡逻辑，获取成功后跳转详情页，不再直接保存**

Modify: `pages/index/index.js`
```javascript
// 修改 handlePunchIn 中的成功回调
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
  ...
})
```

- [ ] **Step 2: 提交代码**

```bash
git add pages/index/index.js
git commit -m "feat: navigate to detail page after punch-in"
```

---

### Task 6: 重构“我的”页面为时间线布局

**Files:**
- Modify: `pages/me/me.wxml`
- Modify: `pages/me/me.wxss`

- [ ] **Step 1: 编写时间线布局 (WXML)**

Modify: `pages/me/me.wxml`
```xml
<view class="timeline-container">
  <view class="timeline-line"></view>
  
  <view class="record-item" wx:for="{{records}}" wx:key="id">
    <!-- 轴点 -->
    <view class="timeline-dot {{index === 0 ? 'active' : ''}}"></view>
    
    <!-- 内容卡片 -->
    <view class="content-card">
      <view class="card-header">
        <text class="time">{{item.time}}</text>
        <text class="mood">{{item.mood}}</text>
      </view>
      
      <view class="note-box" wx:if="{{item.note}}">
        <text class="note-text">{{item.note}}</text>
      </view>
      
      <view class="photo-preview" wx:if="{{item.photos.length > 0}}">
        <image 
          wx:for="{{item.photos}}" 
          wx:for-item="photo" 
          wx:key="*this" 
          src="{{photo}}" 
          mode="aspectFill"
          class="preview-img"
        ></image>
      </view>
      
      <view class="card-footer">
        <view class="location">
          <text class="icon-loc">📍</text>
          <text class="addr-text">已记录位置</text>
        </view>
        <view class="tags">
          <text class="tag" wx:for="{{item.tags}}" wx:for-item="tag" wx:key="*this">#{{tag}}</text>
        </view>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 编写时间线样式 (WXSS)**

Modify: `pages/me/me.wxss`
```css
.timeline-container {
  padding: 40rpx 30rpx;
  position: relative;
  min-height: 100vh;
  background: #f8f8f8;
}
.timeline-line {
  position: absolute;
  left: 55rpx;
  top: 40rpx;
  bottom: 40rpx;
  width: 2rpx;
  background: #eee;
}
.record-item {
  display: flex;
  margin-bottom: 40rpx;
  position: relative;
}
.timeline-dot {
  width: 16rpx;
  height: 16rpx;
  background: #ddd;
  border-radius: 50%;
  border: 6rpx solid #fff;
  z-index: 1;
  margin-top: 20rpx;
  margin-left: 12rpx;
}
.timeline-dot.active {
  background: #07c160;
}
.content-card {
  flex: 1;
  margin-left: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.time {
  font-size: 24rpx;
  color: #999;
}
.mood {
  font-size: 32rpx;
}
.note-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}
.photo-preview {
  display: flex;
  gap: 10rpx;
  margin-top: 16rpx;
}
.preview-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}
.card-footer {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.location {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  color: #07c160;
}
.tag {
  font-size: 20rpx;
  color: #0288d1;
  background: #e1f5fe;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  margin-left: 8rpx;
}
```

- [ ] **Step 3: 提交代码**

```bash
git add pages/me/
git commit -m "feat: implement timeline layout for history page"
```
