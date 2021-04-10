// components/edit/index.js
let utils = require("../../utils/util")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    form:{
      title:'',
      day: '',
      date: '',
      msg: '',
    },
    curDate: '',
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      let form = this.data.form;
      // console.log(event.detail)
      form.date = utils.checkDate(2,event.detail);
      this.setData({
        form
      });
    },
    // 输入
    onChangeTitle(event){
      let form = this.data.form;
      form.title = event.detail;
      this.setData({form})
    },
    onChangeDay(event){
      let form = this.data.form;
      form.day = event.detail;
      this.setData({form})
    },
    onChangeMsg(event){
      let form = this.data.form;
      form.msg = event.detail;
      this.setData({form})
    },
    // 创建 并暴露
    handlerCreate(){
      if(!this.data.form.date) wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      if(!this.data.form.msg.length) return wx.showToast({
        title: '请填写激励话语',
        icon: 'none'
      })
      if(!this.data.form.day.length)return wx.showToast({
        title: '请填写天数',
        icon: 'none'
      })
      if(!this.data.form.title.length)return wx.showToast({
        title: '请填写标题',
        icon: 'none'
      })
      else {
        // console.log("VC",this.data.form);
        let monthArea = [];
        let monthDate = this.data.form.date.substr(0,10);
        for(let i = 0;i < Number(this.data.form.day);i++){
           monthArea[i] = {date: utils.computedDate(monthDate,i),isDo: false, title: this.data.form.title,day: this.data.form.day,msg: this.data.form.msg,idFlag: utils.createRandomId()};
        }
        let res = Object.assign(this.data.form,{monthArea})
        this.triggerEvent('onCreate',{res})
      }
    },
    // 取消
    handlerCancel(){
      let form = this.data.form;
      delete form.date;
      // console.log("FDGFDGFDG",form)
      for(let i in form) {
        form[i] = ""
      }
      this.setData({form});
      this.triggerEvent("onCancel")
    },
    // 初始化 清除方法
    initForm(){
      let form = this.data.form;
      delete form.date;
      // console.log("FDGFDGFDG",form)
      for(let i in form) {
        form[i] = ""
      }
      this.setData({form});
    }
  }
})
