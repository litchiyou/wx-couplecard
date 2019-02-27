//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //接入知晓云后台
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo)
      
    let clientID = '586b687308ebe10b22ed'
    wx.BaaS.init('586b687308ebe10b22ed')
  },
  globalData: {
    userInfo: null,
    heighestScore: 0,
    systemInfo: null,
    zhuan: 0,
    cityName: null,
  }
})