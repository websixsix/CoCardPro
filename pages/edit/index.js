// pages/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      title:'',
      timePlanValue: 0,
      targetValue: 0,
      startValue: new Date(),
      sText:'',
      needWarn: false,
      picture:'LookBook'
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
    ],
    picRootPath:'cloud://cloud1-8gvxy2jc8271232c.636c-cloud1-8gvxy2jc8271232c-1305351695/Icon/',
    showPicPath:'cloud://cloud1-8gvxy2jc8271232c.636c-cloud1-8gvxy2jc8271232c-1305351695/Icon/LookBook.svg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      start:this.formatDate(new Date()),
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
    fakeForm.startValue = new Date(event.detail);
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
    fakeForm.timePlanValue = event.detail.index;
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
    fakeForm.sText = event.detail;
    this.setData({
      form: fakeForm
    })
  },

  onSwitchChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    var fakeForm = this.data.form;
    fakeForm.needWarn = detail;
    this.setData({ form: fakeForm });
  },

  onTargetDisplay(){
    this.setData({targetshow:true});
  },

  onTargetConfirm(event){
    var fakeForm = this.data.form;
    fakeForm.targetValue = event.detail.index;
    this.setData({
      targetshow:false,
      form:fakeForm,
      targetText: event.detail.value
    })
  },

  onPicChange({ detail }){
    var fakeForm = this.data.form;
    fakeForm.picture = detail;
    var newPath = this.data.picRootPath + detail + '.svg';
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
  }
})