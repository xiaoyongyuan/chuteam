import React from 'react'
import { Breadcrumb,Table} from 'antd';
import "./home.less";
import {connect} from "react-redux";
import ReactEcharts from "echarts-for-react";
import {HOMEINFO,WARNING,SEVENDAY,USERINFOR} from "../../config/apiConfig";
import {Http} from "../../server/server";

 class Home extends React.Component{
    state={
        columns:[
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                align:"center",
                render:(text,record,index)=>{
                    return index+1;
                }
            },
            {
                title: '姓名',
                dataIndex: 'realname',
                key: 'realname',
                align:"center"
            },
            {
                title: '完成审核数',
                dataIndex: 'allcount',
                key: 'allcount',
                align:"center"
            },{
                title: '报警数',
                dataIndex: 'alarmcount',
                key: 'alarmcount',
                align:"center"
            },
        ],
        data:[],
        policeList:[],
        statistics:{},
        permission:""
    };
    componentDidMount() {
        this.permissionType();
        this.groupCount();
        this.earlyWarning();
        this.sevenDays();
        this.userInfor();
    }
    //全组当日审核数及预警数
    groupCount=()=>{
        Http(HOMEINFO,{}).then((res)=>{
            this.setState({
                alarmcount:res.alarmcount,
                allcount:res.allcount,
            })
        });
    };
    //实时预警
    earlyWarning=()=>{
        Http(WARNING,{}).then((res)=>{
            this.setState({
                policeList:res.data.slice(0,5)
            })
        })
    };
    //权限类型
    permissionType=()=>{
        let type="";
        let userType=JSON.parse(sessionStorage.getItem("user")).userpower;
        if(userType === "0"){
            type="管理员";
        }else if(userType === "1"){
            type="组长";
        }else if(userType === "2"){
            type="组员";
        }
        this.setState({
            permission:type
        })
    };
    //七天预警统计
    sevenDays=()=>{
        let ydatas=[];
        let allcount=[];//审核数
        let alarmcount=[];//预警数
        let addcount=[];//新增数
        Http(SEVENDAY,{}).then((res)=>{
            res.data.map((item)=>{
                ydatas.push(item.days);
                allcount.push(item.allcount);
                alarmcount.push(item.alarmcount);
                addcount.push(item.addcount);
            });
            this.statistics(ydatas,allcount,alarmcount,addcount);
        });
    };
    statistics=(ydatas,allcount,alarmcount,addcount)=>{
        let statistics={
            legend:{
                data:["审核数","预警数","新增数"],
                orient:"vertical",
                top:0,
                right:0,
                icon:"path://M597.333333 1024a512 512 0 1 1 512-512 512 512 0 0 1-512 512z m0-914.2784A402.2784 402.2784 0 1 0 999.611733 512 402.2784 402.2784 0 0 0 597.333333 109.7216zM597.333333 768a256 256 0 1 1 256-256 256 256 0 0 1-256 256z m0-402.2784A146.2784 146.2784 0 1 0 743.611733 512 146.2784 146.2784 0 0 0 597.333333 365.7216z"
            },
            tooltip:{},
            xAxis: {
                type: 'category',
                data: ydatas
            },
            color:["rgba(224,30,90,1)","rgba(239,162,5,1)","rgba(8,176,136,1)","rgba(56,80,213,1)"],
            yAxis: {
                type: 'value'
            },
            series: [{
                name:"审核数",
                data: allcount,
                type: 'line',
                smooth: true
            },{
                name:"预警数",
                data: alarmcount,
                type: 'line',
                smooth: true
            },{
                name:"新增数",
                data: addcount,
                type: 'line',
                smooth: true
            }]
        };
        this.setState({statistics})
    };
    //当天工作人员工作情况统计
    userInfor=()=>{
        Http(USERINFOR,{}).then((res)=>{
            this.setState({
                data:res.data
            })
        })
    };
    render(){
        return (
            <div className="home">
                <Breadcrumb>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                </Breadcrumb>
                <div className="home-context">
                    <div className="homeLeft">
                        <div className="homeleft-top">
                            <div className="homeleft-pserson nikeName">
                                <p>姓名：{JSON.parse(sessionStorage.getItem("user")).realname}</p>
                                <p>{this.state.permission}</p>
                            </div>
                            <div className="homeleft-pserson unprocessed">
                                <p>剩余未处理</p>
                                <p>{this.props.titlenum}</p>
                            </div>
                            <div className="homeleft-pserson sameDay">
                                <p>全组当日审核数</p>
                                <p>{this.state.alarmcount}</p>
                            </div>
                            <div className="homeleft-pserson warning">
                                <p>全组当日总预警</p>
                                <p>{this.state.allcount}</p>
                            </div>
                        </div>
                        <div className="homeleft-center">
                            <div className="home-title">实时预警情况</div>
                            <div className="police-context">
                                {
                                    this.state.policeList.map((item,index)=>(
                                        <div className="police-item" key={index}>
                                            <img src={"http://"+item.picpath} alt=""/>
                                            <div className="police-name">{item.cname}</div>
                                            {
                                                item.AIstatus === 1
                                                    ? <div className="pass-warning"><span className="pass-img" />通过</div>
                                                    : <div className="police-warning"><span className="police-img" />预警</div>
                                            }

                                        </div>
                                    ))
                                }
                            </div>
                            <div className="more" onClick={()=>{this.props.history.push("/main/history")}}>更多</div>
                        </div>
                        <div className="homeleft-bottom">
                            <div className="home-title">全组七天审核统计情况</div>
                            <ReactEcharts
                                option={this.state.statistics}
                                theme="myTheme"
                            />
                        </div>
                    </div>
                    <div className="homeRight">
                        <div className="home-title">当天工作人员工作情况统计</div>
                        <div className="homeScroll">
                            <Table
                                columns={this.state.columns}
                                dataSource={this.state.data}
                                size="small"
                                pagination={false}
                                className="homeTab"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state=>({
    titlenum:state.reducer.titleCount
});
const mapDispatchToProps=(dispatch)=>({

});
export default connect(mapStateToProps,mapDispatchToProps)(Home);