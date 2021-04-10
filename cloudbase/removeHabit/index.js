// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const remHabit = await db.collection('Habits').doc(event.habitId).remove();

  const remRecords = await db.collection('Records').where({
    habitId: event.habitId
  }).remove();

  return {
    remHabit,
    remRecords
  }
}