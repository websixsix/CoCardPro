const app = getApp()
const db = wx.cloud.database("cloud1");

// pages/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      title:'',
      plan: 0,
      day: 0,
      start: new Date(),
      text:'',
      warn: false,
      picture:'LookBook',
      ownerId: app.globalData.openId,
      complete: null,
      punchDay: 0
    },
    show:false,
    planshow:false,
    targetshow:false,
    TimePlan: ['每天', '工作日', '周一', '周二', '周三','周四','周五','周六','周日'],
    Target: ['永远', '7天','10天', '14天','21天', '30天', '100天', '365天'],
    start: '',
    timePlanText:'每天',
    targetText:'永远',
    picConfig: [
      { text: '看书', value: 'LookBook' },
      { text: '打电话', value: 'Call' },
      { text: '减肥', value: 'CutWeight' },
      { text: '画画', value: 'Painting' },
      { text: '健身', value: 'Sport' },
      { text: '吃蔬菜', value: 'Vegetable' },
    ],
    showPicPath:'cloud://cloud1-8gvxy2jc8271232c.636c-cloud1-8gvxy2jc8271232c-1305351695/Icon/LookBook.svg',
    selectId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var fakeForm = this.data.form;
    fakeForm.ownerId = app.globalData.openId;
    fakeForm.start = new Date();
    //初始化
    this.setData({
      start:this.formatDate(new Date()),
      form: fakeForm
    })

    //测试页面间传输信息
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data) =>{
      console.log(data)
      db.collection('Habits').doc(data).get().then(res => {
        console.log(res);
        
        this.setData({
          selectId: data,
          form: res.data,
          start: this.formatDate(new Date(res.data.start)),
          timePlanText:this.data.TimePlan[res.data.plan],
          targetText: this.data.Target[res.data.day],
          showPicPath: app.globalData.picRootPath + res.data.picture + '.svg'
        })
      })
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
  
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },

  onStartDisplay(){
    this.setData({
      show:true
    })
  },

  onStartConfirm(event){
    var fakeForm = this.data.form;
    fakeForm.start = new Date(event.detail);
    this.setData({
      show: false,
      form: fakeForm,
      start:this.formatDate(event.detail)
    });
  },

  onPlanDisplay(){
    this.setData({
      planshow:true
    })
  },

  onPlanConfirm(event){
    var fakeForm = this.data.form;
    fakeForm.plan = event.detail.index;
    this.setData({
      planshow:false,
      form:fakeForm,
      timePlanText: event.detail.value
    })
  },

  onTitleChange(event){
    var fakeForm = this.data.form;
    fakeForm.title = event.detail;
    this.setData({
      form: fakeForm
    })
  },
  
  onSTextChange(event){
    var fakeForm = this.data.form;
    fakeForm.text = event.detail;
    this.setData({
      form: fakeForm
    })
  },

  onSwitchChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    var fakeForm = this.data.form;
    fakeForm.warn = detail;
    this.setData({ form: fakeForm });
  },

  onTargetDisplay(){
    this.setData({targetshow:true});
  },

  onTargetConfirm(event){
    var fakeForm = this.data.form;
    fakeForm.day = event.detail.index;
    this.setData({
      targetshow:false,
      form:fakeForm,
      targetText: event.detail.value
    })
  },

  onPicChange({ detail }){
    var fakeForm = this.data.form;
    fakeForm.picture = detail;
    var newPath = app.globalData.picRootPath + detail + '.svg';
    this.setData({
      form:fakeForm,
      showPicPath: newPath
    })
  },

  onTargetCancel(){
    this.setData({targetshow:false});
  },
  onPlanCancel(){
    this.setData({planshow:false});
  },
  onStartCancel(){
    this.setData({show:false});
  },

  freshHabitCore(){
    //console.log(this.data.form)
    wx.showLoading({
      title: '保存中',
    })
    //调用指定云函数
    wx.cloud.callFunction({
      name: 'createHabit',
      data: {
        habitId: this.data.selectId,
        habitData: this.data.form
      },
      success: res => {
        console.log(res)

        wx.hideLoading({
          success: (res) => {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          },
        })
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      }
    })
  },
  
  handlerCreate(){
    if(this.data.form.title.trim() == ''){
      wx.showToast({
        title: '请填写完整',
        icon: 'none'
      })
      return;
    }

    this.freshHabitCore();
  }
})