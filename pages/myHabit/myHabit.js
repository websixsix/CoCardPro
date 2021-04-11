const app = getApp()
const db = wx.cloud.database()

// pages/myHabit/myHabit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todoList: [
      // {
      //   title: '没完成的运动量',
      //   day: 3,
      //   text: '我要锻炼我要锻炼我要锻炼我要锻炼我要锻炼我要锻炼',
      //   punchDay: 2,
      //   _id: '2678-1617073331348-02625',
      //   picture: '',
      //   picName: app.globalData.picRootPath +'Sport.svg',
      // }
    ],
    doneList:[
      // {
      //   title: '没完成的运动量',
      //   day: 3,
      //   text: '我要锻炼我要锻炼我要锻炼我要锻炼我要锻炼我要锻炼',
      //   punchDay: 2,
      //   _id: '2678-1617073331348-02625',
      //   picture: '',
      //   picName: app.globalData.picRootPath +'Sport.svg',
      //   completeText: '2021-04-06 09:54',
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('test');

    db.collection('Habits').where({
      ownerId: app.globalData.openId
    }).get().then(res => {
      console.log(res);

      let doneList = [];
      let todoList = [];
      for(var i = 0; i < res.data.length; i++){
        if(res.data[i].complete == null){
          todoList.unshift(res.data[i]);
          todoList[0].picName = app.globalData.picRootPath + todoList[0].picture +'.svg';
        }
        else{
          doneList.unshift(res.data[i]);
          doneList[0].picName = app.globalData.picRootPath + doneList[0].picture +'.svg';
          doneList[0].completeText = this.formatDate(doneList[0].complete);
        }
      }

      this.setData({
        todoList: todoList,
        doneList: doneList
      })

      console.log(todoList, doneList);
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  formatDate(date) {
    date = new Date(date);
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var month = (date.getMonth() + 1) < 10 ? "0" + date.getMonth() : date.getMonth();
    return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
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