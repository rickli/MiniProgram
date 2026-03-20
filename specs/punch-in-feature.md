# Specification: Punch-in Feature (打卡功能)

## 1. Overview
用户可以点击一个按钮来记录当前的打卡时间和地理位置（经纬度）。

## 2. User Stories
- 作为用户，我希望能够一键打卡。
- 作为用户，我希望能够查看我过去的打卡记录。

## 3. Acceptance Criteria (验收标准)
- **打卡操作:**
  - 点击“立即打卡”按钮后，小程序应请求获取地理位置。
  - 获取位置成功后，自动记录当前时间（格式：YYYY-MM-DD HH:mm:ss）。
  - 数据持久化存储到本地 `localStorage`。
  - 打卡成功后显示 Toast 提示。
- **记录展示:**
  - 在“我的”页面，以列表形式展示所有历史记录。
  - 每条记录包含：打卡时间、经度、纬度。
  - 列表应按时间倒序排列（最近的记录排在最前面）。

## 4. UI/UX Requirements
- **首页:** 居中放置一个醒目的打卡按钮。
- **我的页面:** 清晰的列表展示，每项包含时间戳和位置信息。

## 5. Technical Constraints
- 使用微信原生 `wx.getLocation`。
- 本地存储键名为 `PUNCH_RECORDS`。
