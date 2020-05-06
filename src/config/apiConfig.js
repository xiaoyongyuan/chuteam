/**
  * 接口配置文件
  */
const ONLINEBASEURL = window.g.url;

const  LOGIN  =  `${ONLINEBASEURL}/login/verifyforhelper`;  //用户名密码登录
const UPDATEPASS = `${ONLINEBASEURL}/userworker/setpassword`; //修改密码
const USERLIST = `${ONLINEBASEURL}/userworker/getlist`;//用户列表
const RESTPASS = `${ONLINEBASEURL}/userworker/passclear`;//用户重置密码
const DEL = `${ONLINEBASEURL}/userworker/del`;//删除用户
const ADDUSER = `${ONLINEBASEURL}/userworker/add`;//用户添加
const USERDETAIL = `${ONLINEBASEURL}/userworker/getone`;//用户详情
const UPDATE = `${ONLINEBASEURL}/userworker/update`;//用户修改
const HOMEINFO = `${ONLINEBASEURL}/homeinfo/getinfo`;//全组当日审核数，全组当日预警数，
const UNP = `${ONLINEBASEURL}/alarm/getcount`;//未处理数
const WARNING = `${ONLINEBASEURL}/alarm/getlist`;//实时预警
const SEVENDAY = `${ONLINEBASEURL}/homeinfo/getinfo_seven`;//预警七天统计
const USERINFOR = `${ONLINEBASEURL}/homeinfo/getinfo_user`;//当天工作人员工作情况统计
// 历史处理
const AlarmGetlist = `${ONLINEBASEURL}/alarm/getlist`;//历史处理
const AlarmGetone = `${ONLINEBASEURL}/alarm/getone`  //历史处理详情
//工作台
const ALARM_GETONE_HANDLE = `${ONLINEBASEURL}/alarm/getone_handle`;//工作台获取数据
const ALARM_HANDLE = `${ONLINEBASEURL}/alarm/handle`;//工作台保存结果
module.exports = {
    LOGIN, UPDATEPASS, USERLIST, RESTPASS, DEL, ADDUSER, USERDETAIL, UPDATE,
    AlarmGetlist,HOMEINFO,UNP,WARNING,SEVENDAY,USERINFOR,ALARM_GETONE_HANDLE,AlarmGetone,
    ALARM_HANDLE
}