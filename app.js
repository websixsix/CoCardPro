// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init() 
    //获取设定判断是否有授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
            wx.navigateTo({
              url: '/pages/login/index',
            })
        }
      }
    })
  },
  globalData: {
    openid:"",
    userInfo: {},
    hasUserInfo: false,
    picRootPath:'cloud://cloud1-8gvxy2jc8271232c.636c-cloud1-8gvxy2jc8271232c-1305351695/Icon/',
  }
})
