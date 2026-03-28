// app.js

// 拦截和代理以修复系统提示警告
const originalWarn = console.warn;
console.warn = function (...args) {
  const msg = args.join(' ');
  if (
    msg.includes('HarmonyOS') ||
    msg.includes('SharedArrayBuffer') ||
    msg.includes('reportRealtimeAction') ||
    msg.includes('getSystemInfo')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

// 代理可能被隐式调用的过期API
if (wx.getSystemInfoSync) {
  const originalGetSystemInfoSync = wx.getSystemInfoSync;
  wx.getSystemInfoSync = function (...args) {
    if (wx.getDeviceInfo) {
      const deviceInfo = wx.getDeviceInfo();
      const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : {};
      const appBaseInfo = wx.getAppBaseInfo ? wx.getAppBaseInfo() : {};
      return { ...deviceInfo, ...windowInfo, ...appBaseInfo };
    }
    return originalGetSystemInfoSync.apply(wx, args);
  };
}

if (wx.getSystemInfo) {
  const originalGetSystemInfo = wx.getSystemInfo;
  wx.getSystemInfo = function (options = {}) {
    if (wx.getDeviceInfo) {
      try {
        const deviceInfo = wx.getDeviceInfo();
        const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : {};
        const appBaseInfo = wx.getAppBaseInfo ? wx.getAppBaseInfo() : {};
        const res = { ...deviceInfo, ...windowInfo, ...appBaseInfo };
        if (options.success) options.success(res);
        if (options.complete) options.complete(res);
        return;
      } catch (err) {
        if (options.fail) options.fail(err);
        if (options.complete) options.complete(err);
        return;
      }
    }
    return originalGetSystemInfo(options);
  };
}

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null
  }
})
