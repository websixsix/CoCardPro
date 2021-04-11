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
    todoList: [
      // {
      //   _id:'8bb3-1617069314136-83909',
      //   title: '没完成的健康饮食',
      //   day: 5,
      //   ownerId: '',
      //   picture: '',
      //   plan:0,
      //   text: '我要健康我要健康我要健康我要健康我要健康我要健康我要健康',
      //   start: '',
      //   punchDay: 5,
      //   warn: false,
      //   punchDate: '',
      //   punchDateText: '2021-04-06 09:54',
      //   picName: app.globalData.picRootPath + 'Vegetable.svg'
      // }
    ],
    currentDate: null
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
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      currentDate: new Date()
    })
    this.search2Records();
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
    //console.log(event)
    //获取点击到的时间节点---进行比较
    var selectDate = new Date(event.detail);
    this.setData({
      currentDate: selectDate
    })

    this.search2Records();
  },

  search2Records(){
    db.collection('Records').where({
      ownerId: app.globalData.openId
    }).get().then(res => {
      //console.log(res);
      var searchArr = [];
      if(res.data.count <= 0){
        wx.showToast({
          title: '你该日期还未打卡，加油吧',
          icon: 'none',
          duration: 2000
        })
      }
      else{
        const today = new Date(new Date(this.data.currentDate).setHours(0, 0, 0, 0)); //获取当天零点的时间
        const todayEnd = new Date(new Date(this.data.currentDate).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1); //获取当天23:59:59的时间
        
        for(var i = 0; i< res.data.length; i++){
          var punchDate = new Date(res.data[i].punchDate);
          if(punchDate >= today && punchDate <= todayEnd){
            searchArr.unshift(res.data[i]);
            searchArr[0].punchDateText = this.formatDate(punchDate);
            //console.log(this.formatDate(punchDate));
          }
        }
      }

      this.setData({
        todoList: searchArr
      })

      db.collection('Habits').where({
        ownerId: app.globalData.openId
      }).get().then(res2 => {

        //console.log(res2);
        var fakeList = this.data.todoList;
        for(let i = 0; i < fakeList.length; i++){
          for(let j = 0; j < res2.data.length; j++){
            if(fakeList[i].habitId == res2.data[j]._id){
              let merge = Object.assign(fakeList[i], res2.data[j]);
              fakeList[i] = merge;
              fakeList[i].picName = app.globalData.picRootPath + fakeList[i].picture + '.svg';
              break;
            }
          }
        }

        // console.log(fakeList);
        if(fakeList.length <= 0){
          wx.showToast({
            title: '你该日期还未打卡，加油吧',
            icon: 'none',
            duration: 2000
          })
        }
        
        this.setData({
          todoList: fakeList
        })
      })
    })
  },

  formatDate(date) {
    date = new Date(date);
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var month = (date.getMonth() + 1) < 10 ? "0" + date.getMonth() : date.getMonth();
    return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
  },
})