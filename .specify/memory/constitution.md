# SDD Constitution: MiniProgram Punch-in

## 1. Core Principles
- **规范即代码 (Spec as Code):** 所有功能开发必须先定义 Specification (规范)，再制定 Plan (计划)，最后执行 Tasks (任务)。
- **原生微信小程序 (Native WeChat Mini Program):** 必须使用 WXML, WXSS, JavaScript, JSON。
- **极简主义 (Minimalism):** 保持代码简洁，不引入不必要的第三方库。
- **数据驱动 (Data Driven):** 视图与逻辑分离，通过 `this.setData` 更新 UI。

## 2. 技术栈 (Tech Stack)
- **Framework:** WeChat Mini Program Native
- **Language:** JavaScript (ES6+)
- **Storage:** `wx.getStorageSync` / `wx.setStorageSync`
- **Location:** `wx.getLocation` (GCJ-02)

## 3. 代码规范 (Coding Standards)
- **命名:** 驼峰式 (camelCase) 变量和函数名。
- **样式:** 尽量使用 Flexbox 布局。
- **注释:** 关键逻辑点需有中文注释。

## 4. 目录结构
- `/pages`: 页面目录
- `/utils`: 工具类 (时间格式化, 地理位置处理)
- `app.js`, `app.json`, `app.wxss`: 全局入口文件
