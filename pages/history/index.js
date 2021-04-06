// pages/history/index.js
const db = wx.cloud.database("cloud1")
const todo = db.collection("taskList")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPull: false,
    start:0,
    end:0,
    minDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatTime: 0,
    dateFormatter(day){
      if(!app.globalData.formatTime){
        app.globalData.formatTime = 0
      }

      if(app.globalData.formatTime <= 180){
        console.log("fff")
        if(true){
          day.bottomInfo = "未打卡";
        }
        app.globalData.formatTime += 1
      }
      return day;
    },
    todoList: [
      {
        title: '没完成的健康饮食',
        day: 5,
        msg: '我要健康我要健康我要健康我要健康我要健康我要健康我要健康',
        date: '2021-04-06 09:54',
        count: 5,
        rel_id: '8bb3-1617069314136-83909',
        picName: app.globalData.picRootPath + 'Vegetable.svg'
      },
      {
        title: '没完成的运动量',
        day: 3,
        msg: '我要锻炼我要锻炼我要锻炼我要锻炼我要锻炼我要锻炼',
        date: '2021-04-06 16:54',
        count: 2,
        rel_id: '2678-1617073331348-02625',
        picName: app.globalData.picRootPath +'Sport.svg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // todo.get({
    //   success: (res) =>{
    //     console.log("成功",res)
    //     this.setData({
    //       todoList: res.data
    //     })
    //   }
    // })

    //获取当前日期取前后一个月的时间
    var now = new Date()
    console.log(now)
    var min_Day = new Date()
    min_Day.setDate(now.getDate() - 180)
    this.setData({
      minDate: min_Day.getTime(),
      dateFormatter: this.customFormat
    })
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
  //滚动 上
  handlerPullUp(){
    this.setData({isPull: true})
  },
  // 滚动 下
  handlerPullDown(){
    this.setData({isPull: false})
  },

  onSelect(event) {
    //获取点击到的时间节点---进行比较
    var selectDate = new Date(event.detail)
    console.log(selectDate)
    wx.showToast({
      title: '你该日期还未打卡，加油吧',
      icon: 'none',
      duration: 2000
    })
  },
})