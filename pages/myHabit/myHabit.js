const app = getApp()

// pages/myHabit/myHabit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        date: '2021-04-06 09:54',
        count: 2,
        rel_id: '2678-1617073331348-02625',
        picName: app.globalData.picRootPath +'Sport.svg'
      }
    ],
    doneList:[
      {
        title: '我的看书计划',
        day: 5,
        msg: '我的看书计划加油啊',
        date: '2021-03-06 09:54',
        count: 5,
        rel_id: '8bb3-1617069314136-83909',
        picName: app.globalData.picRootPath + 'LookBook.svg',
        doneDate: '2021-03-06 09:54'
      },
      {
        title: '我的减肥计划',
        day: 3,
        msg: '我的减肥计划要成功啊',
        date: '2021-03-06',
        count: 2,
        rel_id: '2678-1617073331348-02625',
        picName: app.globalData.picRootPath +'CutWeight.svg',
        doneDate: '2021-03-06 09:54'
      }
    ]
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

  onClick(event) {

  },
})