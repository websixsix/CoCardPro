// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var res = null;
  
  if(event.habitId == ''){
    //创建习惯
    res = await db.collection('Habits').add({
      data:event.habitData
    })
  }
  else{
    //如果是存在的习惯则更新一些基础信息
    res = await db.collection('Habits').doc(event.habitId).update({
      data:{
        title: event.habitData.title,
        plan: event.habitData.plan,
        day: event.habitData.day,
        start: event.habitData.start,
        text: event.habitData.text,
        warn: event.habitData.warn,
        picture: event.habitData.picture 
      }
    })
  }

  return {
    result:res
  }
}