// logs.js
const util = require('../../utils/util.js');
const db = wx.cloud.database("cloud1");
const todo = db.collection("taskList");
const app = getApp()
Page({
  data: {
    logs: [],
    todoList: [],
    finishNum: 0,
    longTime: 0,
    icon: '',
    name: ''
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    this.fetchList();
    let that = this;
    wx.getStorage({
      key: 'user',
      success: res => {
        console.log("用户信息",JSON.parse(res.data))
        that.setData({
          name: JSON.parse(res.data).nickName,
          icon: JSON.parse(res.data).avatarUrl
        })
      }
    })
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
      wx.reLaunch({
        url: '/pages/history/index',
      })
    }
})
