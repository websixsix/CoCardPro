// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  var loginStr = 'already have';
  const userFind = await db.collection('Users').where({openId : openid}).count();
  if(userFind.total == 0){
    const addUser = await db.collection('Users').add({
      data:{
        openId: openid,
        CurContinueDay: 0,
        MaxContinueDay: 0,
      }
    })
    if(addUser.errMsg == "collection.add:ok"){
      loginStr = 'create succeed';
    }
    else{
      loginStr = 'create fail'
    }
  }


  return {
    openId: wxContext.OPENID,
    sign: loginStr
  }
}