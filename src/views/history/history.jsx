import React from 'react'
import { Breadcrumb,Empty } from 'antd';
import SearchForm from "../../components/myForm/searchForm"
import MyPagination from "../../components/myPagination/myPagination"
import HistoryModal from "./historyModal"
import { Http } from '../../server/server'
import { AlarmGetlist, AlarmGetone } from "../../config/apiConfig"
import moment from 'moment'
import Image from "../../assets/images/warning_image.png"
import './history.less'
export default class History extends React.Component {
    state = {
        editedata: {},
        // handleinfo: {},
        // detail: [],
        // xScale:0,
        // yScale:0,
        searchdata: {},
        Rolev: false,
        pagination: {
            total: 800,
            pageSize: 12,
            current: 1
        },
        list: [],
    }
    renderSearchFormList = () => {
        var alarm = JSON.parse(sessionStorage.getItem("alarm"));
        var list = [{ name: '全部', value: 'all' }];
        alarm.alarmInfo.map((item, index) => {
            list.push({
                name: item, value: index + ""
            })
        })
        let searchFormList = [
            {
                type: 'DATES',
                label: '时间',
                id: 'searchTime',
                // initialValue: moment(),
                width: 360,
                showTime: true
            },

        ]
        if (JSON.parse(sessionStorage.getItem('user')).userpower != '2') {
            searchFormList.push({
                type: 'INPUT',
                label: '处理人',
                id: 'handlemen',
                placeholder: '请输入处理人',
                width: 200,
            })
        }
        searchFormList.push(
            {
                type: 'SELECT',
                label: '处理状态',
                id: 'handlestatus',
                placeholder: '请选择处理状态',
                initialValue: 'all',
                width: 117,
                list: [{ name: '全部', value: 'all' }, { name: '通过', value: '1' }, { name: '预警', value: '2' }]
            }
        );

        searchFormList.push(
            {
                type: 'SELECT',
                label: '审核情况',
                id: 'handleobject',
                // handleobject
                placeholder: '请选择审核情况',
                initialValue: 'all',
                width: 117,
                list: list
            },
        )

        return searchFormList
    }

    handleSearch = values => {
        var searchdata = {};
        searchdata.handlemen = values.handlemen ? values.handlemen : "";
        searchdata.handleobject = values.handleobject == "all" ? "" : values.handleobject;
        searchdata.handlestatus = values.handlestatus == "all" ? "" : values.handlestatus;
        searchdata.bdate = values.searchTime ? values.searchTime[0].format("YYYY-MM-DD HH:mm:ss") : "";
        searchdata.edate = values.searchTime ? values.searchTime[1].format("YYYY-MM-DD HH:mm:ss") : "";
        this.setState({
            searchdata
        }, () => {
            this.RequestData();
        })
    }
    paginationChange = pagination => {
        this.setState({
            pagination
        }, () => {
            this.RequestData();
        })
    }
    // 详情取消
    ificonModal() {
        this.setState({
            Rolev: false,
            ifedit: false,
            editedata: {},
            // handleinfo: {},
            // detail: [],
            // xScale:0,
            // yScale:0,
        })
    }
    // 详情
    showDetailModal(item) {
        this.setState({
            Rolev: true,
            ifedit: true,
            editedata: item,
            // handleinfo: {},
            // detail: [],
            // xScale:0,
            // yScale:0,
        })
        // var senddata = { code: item.code + "" };
        // Http(AlarmGetone, senddata).then(res => {
        //     if (res.success) {
        //         let xScale = parseFloat(parseInt(res.data.pic_w) / 635).toFixed(2);
        //         let yScale = parseFloat(parseInt(res.data.pic_h) / 432).toFixed(2);
        //         this.setState({
        //             handleinfo: res.data.handleinfo,
        //             detail: res.data,
        //             Rolev: true,
        //             xScale,
        //             yScale
        //         }, () => {
        //             // setTimeout(() => {
        //             //     this.canvasfun();
        //             // });
        //         })
        //     }
        // })
    }
    componentDidMount() {
        let _this = this;
        _this.RequestData();
    };
    RequestData() {
        // 审核处理列表
        var senddata = { pagesize: this.state.pagination.pageSize, pageindex: this.state.pagination.current };
        if (Object.keys(this.state.searchdata).length) {
            if (this.state.searchdata.handlemen) {
                senddata.handlemen = this.state.searchdata.handlemen;
            }
            if (this.state.searchdata.handleobject) {
                senddata.handleobject = this.state.searchdata.handleobject;
            }
            if (this.state.searchdata.handlestatus) {
                senddata.handlestatus = this.state.searchdata.handlestatus;
            }
            if (this.state.searchdata.bdate) {
                senddata.bdate = this.state.searchdata.bdate;
                senddata.edate = this.state.searchdata.edate;
            }
        }
        Http(AlarmGetlist, senddata).then(res => {
            if (res.success) {
                this.setState({
                    list: res.data,
                    pagination: {
                        total: res.totalcount,
                        pageSize: res.pagesize,
                        current: res.page,
                    }
                })
            }
        })
    }
    render() {
        return (
            <div className='historyWrap'>
                <Breadcrumb>
                    <Breadcrumb.Item>历史处理</Breadcrumb.Item>
                </Breadcrumb>
                <div className='mySearchFormWrap'>
                    <SearchForm formList={this.renderSearchFormList()} buttonText='搜索' handleSearch={this.handleSearch} />
                </div>
                <div className='listWrap'>
                    <div className='flexWrap'>
                        {this.state.list.length > 0 ? this.state.list.map(item => {
                            return <div className='historyItem' key={item.code} onClick={() => { this.showDetailModal(item) }}>
                                <div className='imgWrap'>
                                    <img src={"http://" + item.picpath} style={{ width: '100%', height: "100%", borderRadius: '10px' }} alt='历史'></img>
                                </div>
                                <div className='historyInfo'>
                                    <div className='companyName' title={item.cname}>{item.cname}</div>
                                    <div className='location' title={item.linkaddress}>{item.linkaddress}</div>
                                    <div className='location' title={item.handletime}>{item.handletime}</div>
                                    <div className='handleName'>处理人：<span title={item.handlemen}>{item.handlemen}</span></div>
                                </div>
                                {item.handlestatus == 1 ? <div className='pass'><span className='xuanzhuan'>通过</span></div> : <div className='noPass'><span className='xuanzhuan'>预警</span></div>}

                            </div>
                        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{textAlign:'center',width:'100%'}}/>}
                    </div>

                    <MyPagination pagination={this.state.pagination} handlePaginationChange={this.paginationChange} pageSizeOptions={[12, 18, 24, 30]} />
                </div>
                <HistoryModal Rolev={this.state.Rolev} ificonModal={this.ificonModal.bind(this)} editedata={this.state.editedata} ifedit={this.state.ifedit} />
            </div>
        )
    }
}