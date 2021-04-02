// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database("cloud1");
const todo = db.collection("taskList");
// 云函数入口函数
exports.main = async (event, context) => {
    todo.where({
      
    })
}