// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init() 


    // wx.navigateTo({
    //   url: '/pages/login/index',
    // })
  },
  globalData: {
    openId:"",
    userInfo: {},
    hasUserInfo: false,
    picRootPath:'cloud://cloud1-8gvxy2jc8271232c.636c-cloud1-8gvxy2jc8271232c-1305351695/Icon/',
  },

  trans2Day(plan){
    var day = 0
    switch(plan){
      case 0:
        day = -1;
        break;
      case 1:
        day = 7;
        break;
      case 2:
        day = 10;
        break;
      case 3:
        day = 14;
        break;
      case 4:
        day = 21;
        break;
      case 5:
        day = 30;
        break;
      case 6:
        day = 100;
        break;
      case 7:
        day = 365;
        break;
    }
    return day
  }
})
