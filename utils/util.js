let dayjs = require('./day')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
//转换 时间戳
function checkDate(type,val){
  switch(type){
    case 1:{
      return dayjs(val).format('YYYY-MM-DD')
    }break;
    case 2:{
      return dayjs(val).format('YYYY-MM-DD HH:mm')
    } break;
  }
}
// 计算离创建开始的 时间区间
function computedDate(val,target){
  return dayjs(val).add(target, 'day').format('YYYY-MM-DD');
  // return dayjs(val).add(target, 'day').format('YYYY-MM-DD')
}
//获取当前系统时间
function getNowTime(){
  console.log("获取", dayjs().format('YYYY-MM-DD'));
  return dayjs().format('YYYY-MM-DD')
}
// 生成随机不重复id
function createRandomId() {
  return (
    (Math.random() * 10000000).toString(16).substr(0, 4) +
    "-" +
    new Date().getTime() +
    "-" +
    Math.random().toString().substr(2, 5)
  );
}
module.exports = {
  formatTime,
  checkDate,
  computedDate,
  getNowTime,
  createRandomId
}
