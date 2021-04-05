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
    todoList: [],
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
    // this.fetchList()
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
        selectDate
      })
      this.setData({
        nowDate:selectDate
      })
      this.fetchList()
      this.handlerDateClose()
  },
  // 去编辑
  handlerGoEdit(){
    wx.navigateTo({
      url: "/pages/edit/index",
    })
    // this.setData({editForm: true});
    // this.selectComponent('#editForm').initForm();

  },
  // 勾选当前任务
  handlerDo(event){
    console.log("GFG",event.currentTarget.dataset.id)
    console.log("GFG",event.currentTarget.dataset.date)
    console.log("GFG",event.currentTarget.dataset.rel)
    todo.where({
      rel_id: event.currentTarget.dataset.rel
    }).get().then(res => {
      let monthArea = res.data[0].monthArea;
      console.log("getget",monthArea);
      let index = monthArea.findIndex(e => {
        return e.date === event.currentTarget.dataset.date
      })
      monthArea[index].isDo = true;
      console.log("索引",monthArea);
      this.updateList(event.currentTarget.dataset.rel,monthArea)
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
    todo.get({
      success: res => {
        console.log("获取",res);
        console.log("匹配内容",this.picNowList(res));
        this.setData({
          todoList: this.picNowList(res)
        },result => wx.hideLoading())
      }
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
          console.log("被刪除的id",event.currentTarget.dataset.id);
          todo.where({
            rel_id: event.currentTarget.dataset.id
          }).remove({
            success: (res) => {
              that.fetchList();
              let list = that.data.todoList;
              list.splice(event.currentTarget.dataset.todoList,1)
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
