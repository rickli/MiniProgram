# Immersive Diary Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有的详情页重构为具有仪式感的“沉浸式大卡片”风格日记扉页。

**Architecture:** 
- 采用单一白色大卡片作为主容器，内部划分为 Header、Mood、Diary、Gallery 和 Footer 模块。
- 使用 CSS `linear-gradient` 实现沉浸式顶栏。
- 引入 `box-shadow` 和 `transform` 增强交互动效。

**Tech Stack:** 微信小程序 (WXML, WXSS, JS)。

---

### Task 1: 容器与沉浸式顶栏重构

**Files:**
- Modify: `pages/detail/detail.wxml`
- Modify: `pages/detail/detail.wxss`

- [ ] **Step 1: 修改 WXML 结构，包裹大卡片并重定义 Header**

Modify: `pages/detail/detail.wxml`
```xml
<view class="page-bg">
  <view class="diary-card">
    <!-- 1. 叙事顶栏 -->
    <view class="diary-header">
      <view class="header-content">
        <text class="header-time">{{record.time}}</text>
        <view class="header-loc">
          <text class="icon-loc">📍</text>
          <text>{{record.address || '正在获取地址...'}}</text>
        </view>
      </view>
    </view>

    <view class="card-body">
      <!-- 后续模块将填入此处 -->
    </view>
  </view>
</view>
```

- [ ] **Step 2: 编写基础背景与渐变 Header 样式**

Modify: `pages/detail/detail.wxss`
```css
.page-bg {
  min-height: 100vh;
  background: #f4f5f7;
  padding: 30rpx;
  box-sizing: border-box;
}

.diary-card {
  background: #fff;
  border-radius: 28rpx;
  min-height: calc(100vh - 60rpx);
  box-shadow: 0 15rpx 45rpx rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.diary-header {
  height: 200rpx;
  background: linear-gradient(135deg, #07c160 0%, #00b0ff 100%);
  color: #fff;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
}

.header-time {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  letter-spacing: 1rpx;
}

.header-loc {
  font-size: 24rpx;
  opacity: 0.9;
  margin-top: 10rpx;
  display: flex;
  align-items: center;
}

.icon-loc {
  margin-right: 6rpx;
}

.card-body {
  padding: 40rpx 30rpx;
  flex: 1;
}
```

- [ ] **Step 3: 提交代码**

```bash
git add pages/detail/
git commit -m "style: implement immersive card layout and gradient header"
```

---

### Task 2: 悬浮心情选择器升级

**Files:**
- Modify: `pages/detail/detail.wxml`
- Modify: `pages/detail/detail.wxss`

- [ ] **Step 1: 更新心情选择器 WXML**

Modify: `pages/detail/detail.wxml` (在 card-body 中添加)
```xml
<view class="section">
  <view class="section-title">此刻心情</view>
  <view class="mood-selector">
    <view 
      wx:for="{{moods}}" 
      wx:key="index" 
      class="mood-opt {{selectedMood === item ? 'active' : ''}}" 
      bindtap="selectMood" 
      data-mood="{{item}}"
    >
      {{item}}
    </view>
  </view>
</view>
```

- [ ] **Step 2: 编写带缩放动效的心情样式**

Modify: `pages/detail/detail.wxss`
```css
.section-title {
  font-size: 22rpx;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: 4rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.mood-selector {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50rpx;
}

.mood-opt {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  border-radius: 28rpx;
  background: #f8f9fb;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.mood-opt.active {
  background: #07c160;
  transform: scale(1.15) translateY(-6rpx);
  box-shadow: 0 12rpx 30rpx rgba(7,193,96,0.3);
}
```

- [ ] **Step 3: 提交代码**

```bash
git add pages/detail/
git commit -m "style: upgrade mood selector with scale animation"
```

---

### Task 3: 纸感手记与拍立得影集

**Files:**
- Modify: `pages/detail/detail.wxml`
- Modify: `pages/detail/detail.wxss`

- [ ] **Step 1: 添加手记与影集 WXML**

Modify: `pages/detail/detail.wxml` (接 Task 2)
```xml
<view class="section">
  <view class="section-title">心迹</view>
  <textarea 
    class="diary-input" 
    placeholder="写下此刻的思绪..." 
    bindinput="onNoteInput"
    maxlength="500"
    placeholder-class="input-placeholder"
  ></textarea>
</view>

<view class="section">
  <view class="section-title">影像</view>
  <view class="polaroid-gallery">
    <view class="polaroid-item" wx:for="{{photos}}" wx:key="*this" bindtap="previewImage" data-url="{{item}}">
      <image src="{{item}}" mode="aspectFill" class="polaroid-img"></image>
      <view class="delete-tag" catchtap="deletePhoto" data-index="{{index}}">×</view>
    </view>
    <view class="photo-add-btn" bindtap="chooseImage" wx:if="{{photos.length < 3}}">
      <text class="add-icon">+</text>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 编写引导线手记与拍立得样式**

Modify: `pages/detail/detail.wxss`
```css
.diary-input {
  width: 100%;
  min-height: 240rpx;
  font-size: 30rpx;
  color: #444;
  line-height: 1.8;
  border-left: 4rpx solid #f0f0f0;
  padding-left: 24rpx;
  margin-bottom: 40rpx;
}

.input-placeholder {
  color: #ccc;
  font-style: italic;
}

.polaroid-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.polaroid-item {
  width: 160rpx;
  padding: 10rpx 10rpx 30rpx 10rpx;
  background: #fff;
  box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.08);
  position: relative;
  /* 随机轻微旋转效果由实现者决定，或保持整齐 */
}

.polaroid-img {
  width: 160rpx;
  height: 160rpx;
  background: #f8f8f8;
}

.delete-tag {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 36rpx;
  height: 36rpx;
  background: rgba(0,0,0,0.4);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.photo-add-btn {
  width: 180rpx;
  height: 200rpx;
  background: #f8f9fb;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 60rpx;
  color: #ccc;
  font-weight: 200;
}
```

- [ ] **Step 3: 提交代码**

```bash
git add pages/detail/
git commit -m "style: implement paper-style input and polaroid gallery"
```

---

### Task 4: 标签系统与悬浮保存按钮

**Files:**
- Modify: `pages/detail/detail.wxml`
- Modify: `pages/detail/detail.wxss`

- [ ] **Step 1: 完善标签 UI 并添加悬浮按钮**

Modify: `pages/detail/detail.wxml`
```xml
<view class="section">
  <view class="section-title">标签</view>
  <view class="diary-tags">
    <view 
      wx:for="{{presetTags}}" 
      wx:key="*this"
      class="diary-tag {{selectedTags.includes(item) ? 'active' : ''}}"
      bindtap="toggleTag"
      data-tag="{{item}}"
    >
      #{{item}}
    </view>
  </view>
</view>

<!-- 悬浮保存按钮 -->
<view class="diary-footer">
  <view class="save-pill-btn" bindtap="handleSave">
    <text>珍藏这一页</text>
  </view>
</view>
```

- [ ] **Step 2: 编写胶囊标签与发光悬浮按钮样式**

Modify: `pages/detail/detail.wxss`
```css
.diary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 120rpx;
}

.diary-tag {
  padding: 10rpx 28rpx;
  background: #f3f3f3;
  color: #888;
  border-radius: 40rpx;
  font-size: 24rpx;
  transition: all 0.2s;
}

.diary-tag.active {
  background: #e1f5fe;
  color: #0288d1;
  font-weight: 500;
}

.diary-footer {
  position: absolute;
  bottom: 60rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none; /* 穿透点击背景 */
}

.save-pill-btn {
  pointer-events: auto; /* 恢复点击 */
  width: 320rpx;
  height: 96rpx;
  background: #07c160;
  color: #fff;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  box-shadow: 0 15rpx 35rpx rgba(7,193,96,0.35);
}

.save-pill-btn:active {
  transform: scale(0.96);
  opacity: 0.9;
}
```

- [ ] **Step 3: 提交代码**

```bash
git add pages/detail/
git commit -m "style: implement pill tags and floating save button"
```
