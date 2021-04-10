// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

function trans2Day(dayId){
  var day = 0
  switch(dayId){
    case 0:
      day = -1;
      break;
    case 1:
      day = 7;
      break;
    case 2:
      day = 10;
      break;
    case 3:
      day = 14;
      break;
    case 4:
      day = 21;
      break;
    case 5:
      day = 30;
      break;
    case 6:
      day = 100;
      break;
    case 7:
      day = 365;
      break;
  }
  return day
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var oprRecords = null;
  const getHabitInfo = await db.collection('Habits').doc(event.habitId).get();
  var newData = getHabitInfo.data;
  delete newData._id;

  if(event.isCancelPunch){
    oprRecords = await db.collection('Records').doc(event.cancelId).remove();
    
    newData.punchDay -= 1;

    if(newData.complete){
      newData.complete = null
    }
  }
  else{
    oprRecords = await db.collection('Records').add({
      data:{
        habitId: event.habitId,
        punchDate: new Date(),
        ownerId:wxContext.OPENID,
      }
    });

    newData.punchDay += 1;
    var targetDay = trans2Day(newData.day);
    if(targetDay > 0 && newData.punchDay >= targetDay){
      newData.complete = new Date();
    }
  }
  
  const editHabitInfo = await db.collection('Habits').doc(event.habitId).update({
    data:newData
  })

  return {
    oprRecords,
    editHabitInfo
  }
}