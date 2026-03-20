# Plan: Punch-in Implementation (打卡功能实现)

## 1. File Structure
- `app.json`: 定义页面路由和 tabBar。
- `pages/index/index`: 打卡页面。
- `pages/me/me`: 记录展示页面。
- `utils/util.js`: 时间格式化函数。

## 2. Implementation Steps

### Task 1: Initialize Global Configuration
- **app.json**:
  - `pages`: `["pages/index/index", "pages/me/me"]`
  - `tabBar`:
    - List:
      - pagePath: `pages/index/index`, text: "打卡", icon: (optional)
      - pagePath: `pages/me/me`, text: "我的", icon: (optional)
  - `permission`: 添加 `scope.userLocation` 权限申请说明。
- **project.config.json**:
  - 基础项目配置。

### Task 2: Utility for Time Formatting
- **utils/util.js**: 实现 `formatTime` 函数。

### Task 3: Index Page (Punch-in)
- **index.wxml**: 放置一个 `<button type="primary" bindtap="handlePunchIn">立即打卡</button>`。
- **index.js**:
  - `handlePunchIn` 方法：
    - `wx.getLocation({ type: 'gcj02' })`
    - 获取成功后：
      - 获取当前时间并格式化。
      - 构造记录对象：`{ time, latitude, longitude }`。
      - 从本地缓存获取 `PUNCH_RECORDS`。
      - 将新记录 push 到数组开头。
      - `wx.setStorageSync('PUNCH_RECORDS', list)`。
      - 显示成功 Toast。

### Task 4: Me Page (History)
- **me.wxml**: 使用 `wx:for` 遍历 `records` 数组，展示 `time`, `latitude`, `longitude`。
- **me.js**:
  - `onShow` 生命周期：
    - 从 `wx.getStorageSync('PUNCH_RECORDS')` 加载数据。
    - `setData` 更新 UI。

### Task 5: App Styling
- **app.wxss**: 全局样式（如背景颜色、padding 等）。
- **pages/index/index.wxss**: 按钮样式。
- **pages/me/me.wxss**: 列表样式。

## 3. Verification Plan
- 在真机或模拟器中点击打卡，确认弹窗。
- 确认本地存储中是否有数据。
- 确认“我的”页面列表能正确拉取并展示最近的一条。
