// pages/login/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSucceed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.reLaunch({
    //   url: '/pages/login/index'
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 授权&登录
  getUserInfo(res){
    if(this.data.isSucceed) return;
    // 登录
    if (!wx.cloud) {
      //云服务端出现问题
      wx.showToast({
        title: '网络错误，登录失败',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        app.globalData.hasUserInfo = true

        this.setData({
          isSucceed:true
        })
        
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            app.globalData.openId = res.result.openId
            // console.log(res,app.globalData.openId)
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000,
              complete: ()=>{
                setTimeout(() => {
                  wx.reLaunch({
                    url: '/pages/logs/logs',
                  })
                }, 2000);
              }
            })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      },
      fail: (err) => {
        console.log(err)
        wx.reLaunch({
          url: '/pages/login/index',
        })
      }
    })
  }
})