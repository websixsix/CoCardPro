// logs.js
const util = require('../../utils/util.js');
const db = wx.cloud.database()
const todo = db.collection("taskList");
const app = getApp()
Page({
  data: {
    logs: [],
    todoList: [],
    finishNum: 0,
    longTime: 0,
    icon: '',
    name: '',
    curContinueDay: 0,
    maxContinueDay: 0,
    punchNumber: 0,
    habitNumber: 0
  },
  onLoad() {
    console.log("全局",app.globalData);
    this.setData({
      name : app.globalData.userInfo.nickName,
      icon : app.globalData.userInfo.avatarUrl
    });
    // this.fetchList();
    // let that = this;
    // wx.getStorage({
    //   key: 'user',
    //   success: res => {
    //     console.log("用户信息",JSON.parse(res.data))
    //     that.setData({
    //       name: JSON.parse(res.data).nickName,
    //       icon: JSON.parse(res.data).avatarUrl
    //     })
    //   }
    // })
  },
  // 拉取 创建数据
  fetchList(){
    todo.get({
      success: res => {
        console.log("加载完成",res)
        this.setData({
          todoList: res.data
        },res => {
          wx.hideLoading()
          console.log("count",this.pickOkHabit(this.data.todoList))
          console.log("long", Math.max.apply(null, this.pickLongTime(this.data.todoList)))
          this.setData({
            finishNum: this.pickOkHabit(this.data.todoList),
            longTime: Math.max.apply(null, this.pickLongTime(this.data.todoList))
          })
        })
      }
    })
  },
  // 筛选完成习惯
  pickOkHabit(arr){
    let count = 0;
    for(let i =0;i<arr.length;i++){
        let flag = arr[i].monthArea.every(el => {
          return el.isDo === true
        });
        if(flag) count++
    }
    return count
  },
  // 筛选最长完成的时间
  pickLongTime(arr){
    let pickArr = [];
    for(let i = 0; i<arr.length;i++){
      let cur = arr[i].monthArea.filter(e => {
        return e.isDo === true
      })
      console.log("匹配到的",cur)
      pickArr[i] = cur.length
    }
    return pickArr
  },
  // 跳转我的记录
  handlerGo(){
    wx.navigateTo({
      url: '/pages/myHabit/myHabit',
    })
  },
  onShow: function () {
    db.collection('Users').where({
      openId: app.globalData.openId // 填入当前用户 openid
    }).get().then(res => {
      // console.log(res,app.globalData.openId)
      this.setData({
        curContinueDay:res.data[0].CurContinueDay,
        maxContinueDay:res.data[0].MaxContinueDay
      })
    })
    
    db.collection('Habits').where({
      ownerId: app.globalData.openId
    }).get().then(res => {
      //console.log(res);
      var habitNum = res.data.length;
      var punchNum = 0;
      for(var i = 0; i < res.data.length; i++){
        punchNum += res.data[i].punchDay;
      }

      this.setData({
        habitNumber: habitNum,
        punchNumber: punchNum
      })
    })
  },
})
