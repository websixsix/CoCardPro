// index.js
// 获取应用实例
const db = wx.cloud.database("cloud1");
const todo = db.collection("taskList")
const app = getApp()
const utils = require("../../utils/util")
/* 
  @params {boolean} show 控制时间选择弹窗 checked控制是否勾选
*/
Page({
  data: {
    show: false,
    currentDate: new Date().getTime(),
    selectDate: '',
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    checked: false,
    editForm: false,
    todoList: [
      // {
      //   _id:'3234',
      //   title: '我的第一324个打卡',
      //   day: 5,
      //   plan: 0,
      //   text: '我的第一个打卡要加油啊',
      //   start: '2021-04-06 09:54',
      //   punchDay: 5,
      //   ownerId:'',
      //   warn: false,
      //   picture:'',
      //   picName: app.globalData.picRootPath + 'Call.svg',
      //   isPunch: false,
      //   todayPunchId: '' //今日打卡的ID
      // }
    ],
    nowDate: utils.getNowTime()
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    utils.computedDate('2021-03-16',3)
    // 初始化时间
    let selectDate = utils.checkDate(1,this.data.currentDate);
    this.setData({
      selectDate
    });

    this.fetchList()
  },
  // 选择时间弹窗
  handlerDatePicker(){
    this.setData({
      show: true
    })
  },
  // 关闭弹窗
  handlerDateClose(val){
    this.setData({
      show: false
    })
  },
  // 获取选择时间
  onGetSelect(res){
    console.log("获取0",res);
    let selectDate = utils.checkDate(1,res.detail);
    this.setData({
      currentDate: res.detail,
      show: false,
      selectDate:selectDate
    })
      // this.setData({
      //   nowDate:selectDate
      // })
    this.fetchList();

      // this.handlerDateClose()
  },

  //去编辑
  handlerGoEdit(event){
    console.log(event)

    wx.navigateTo({
      url: "/pages/edit/index",
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage',  event.target.dataset.id)
      }
    })
  },
  // 去添加
  handlerGoAdd(){
    wx.navigateTo({
      url: "/pages/edit/index"
    })
  },
  // 勾选当前任务
  handlerDo(event){
    // console.log(event);
    const data = event.target.dataset;
    let self = this;
    
    if(data.bool){
      wx.showModal({
        title: '提示',
        content: '确定要取消打卡吗？',
        success (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '处理中',
              success: (res) => {
                self.exchange2Punch(data);
              }
            })
          }
        }
      })
    }
    else{
      wx.showLoading({
        title: '处理中',
        success: (res) => {
          self.exchange2Punch(data);
        }
      })
    }
  },

  exchange2Punch(data){
    //调用指定云函数
    wx.cloud.callFunction({
      name: 'punchHabit',
      data: {
        habitId: data.id,
        isCancelPunch: data.bool,
        cancelId: this.data.todoList[data.index].todayPunchId
      },
      success: res => {
        //console.log(res)
        var tipStr = "";
        var fakeList = this.data.todoList;
        if(res.result.oprRecords.errMsg == "document.remove:ok"){
          //取消打卡成功
          fakeList[data.index].isPunch = false;
          fakeList[data.index].punchDay -= 1;
          fakeList[data.index].todayPunchId = '';

          tipStr = "取消打卡成功";
        }
        else if(res.result.oprRecords.errMsg == "collection.add:ok"){
          //打卡成功
          fakeList[data.index].isPunch = true;
          fakeList[data.index].punchDay += 1;
          fakeList[data.index].todayPunchId = res.result.oprRecords._id;
          
          tipStr = "打卡成功";
        }
        else{
          wx.showToast({
            title: '出错了，请检查服务器',
            icon: 'fail'
          })
        }
        
        // todo 直接打卡成功  添加打卡记录 -> 习惯里的打卡天数 + 1 
        this.setData({
          todoList:fakeList
        })

        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: tipStr,
            })
          },
        })

      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      }
    })
  },

  // 关闭 添加弹窗
  handlerClose(){
    this.setData({
      editForm: false
    })
  },
  // 获取 创建数据
  handlerAdd(event){
    console.log("获取",event.detail.res);
    const rel_id = utils.createRandomId();
    console.log("创建",rel_id)
    let obj = event.detail.res;
    console.log("创建得到的对象",obj)
    for(let i=0; i < obj.monthArea.length; i++){
       obj.monthArea[i] = Object.assign(obj.monthArea[i],{rel_id})
    }
    todo.add({
      data:{
        title: obj.title,
        day: obj.day,
        msg: obj.msg,
        date: obj.date,
        count: 0,
        rel_id,
        monthArea: obj.monthArea
      },
      success: res => {
        console.log("创建",res);
        this.setData({editForm: false},result => this.onLoad())
      }
    })
  },
  // 取消
  handlerCancel(){
    this.setData({editForm: false})
  },
  // 拉取 创建数据
  fetchList(){
    wx.showLoading({
      title: '加载中',
    })

    db.collection('Habits').where({
      ownerId: app.globalData.openId
    }).get().then(res => {
      const today = new Date(new Date(this.data.currentDate).setHours(0, 0, 0, 0)); //获取当天零点的时间
      const todayEnd = new Date(new Date(this.data.currentDate).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1); //获取当天23:59:59的时间
      const week = today.getDay();  //获取星期几

      let newList = [];
      for(let i = 0; i < res.data.length; i++){
        let startDate = new Date(res.data[i].start);
        //console.log(startDate,todayEnd)
        //let targetDay = app.trans2Day(res.data[i].day);

        let canShow = true;
        if(res.data[i].complete){
          //console.log(res.data[i])
          const completeDate = new Date(res.data[i].complete);
          if(completeDate < today){
            canShow = false;
          }
        }
        if(startDate > todayEnd){
            canShow = false;
        }
        switch(res.data[i].plan){
          case 1:
            if(week < 1 || week > 5) canShow = false;
            break;
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
            if(week != (res.data[i].plan - 1)) canShow = false;
            break;
          case 7:
            if(week != 0) canShow = false;
            break;
        }

        if(canShow){
          newList.unshift(res.data[i]);
          newList[0].picName = app.globalData.picRootPath + res.data[i].picture + '.svg';
          newList[0].isPunch = false;
          newList[0].todayPunchId = '';
        }
      }
      
      this.setData({
        todoList: newList
      })

      db.collection('Records').where({
        ownerId:app.globalData.openId
      }).get().then(res => {
        var fakeTodo = this.data.todoList;

        for(var i = 0; i < fakeTodo.length; i++){
          for(var j = 0; j < res.data.length; j++){
            var punchDate = new Date(res.data[j].punchDate);
            if(punchDate > today && punchDate < todayEnd && fakeTodo[i].ownerId == res.data[j].ownerId){
            // 判断打卡时间是否在今天（限定的时间）  如果是 则 isPunch为true 再跳出
              fakeTodo[i].isPunch = true;
              fakeTodo[i].todayPunchId = res.data[j]._id;
              break;
            }
          }
        }
        this.setData({
          todoList: fakeTodo
        })

        wx.hideLoading({
          success: (res) => {},
        })
      })

    })
  },
  // 刪除
  handlerDeCur(event){
    let that = this;
    wx.showModal({
      title: '郑重提示',
      content: '确定要移除你所选中的习惯？',
      success (res) {
        if (res.confirm) {
          var data = event.currentTarget.dataset;
          console.log("被刪除的id",data.id);

          wx.cloud.callFunction({
            name: 'removeHabit',
            data: {
              habitId: data.id
            },
            success: res => {
              //console.log(res)

              var fakeList = this.data.todoList;
              fakeList.splice(data.index, 1);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 匹配当天数据
  picNowList(res){
    let newArr = [];
    console.log("被搜搜",res);
    console.log("查找索引",this.data.nowDate);
    for(let i = 0;i < res.data.length;i++){
       newArr.push(...res.data[i].monthArea)
      console.log("key-valuvfe",newArr);
    }
    console.log("BBBBBBBBBBBB",newArr);
    let b = newArr.filter(e => {
      return e.date === this.data.nowDate
    })
    return b
  },
  // 更新数据
  updateList(rel_id,monthArea){
    todo.where({
      rel_id
    }).update({
      data:{
        monthArea
      }
    }).then(res =>{
      this.fetchList()
    })
  }
})
