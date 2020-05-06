import React, { Component } from "react";
import { Modal } from 'antd';
import './history.less'
import CloseIcon from "../../assets/images/icon_close.png"
import PassIcon from "../../assets/images/icon_pass.png"
import PassDetailImage from "../../assets/images/warning_detail_image_pass.png"
import NopassDetailImage from "../../assets/images/warning_detail_image_nopass.png"
import { Http } from '../../server/server'
import { AlarmGetone } from "../../config/apiConfig"
var ifedit = false;
class historyModal extends React.Component {
    state = {
        editedata: {},
        handleinfo: {},
        detail: [],
        xScale: 0,
        yScale: 0,

        detail: {
            company: 'xxxxxxxxxx',
            address: '丈八六路理工大学科技园',
            name: '张三',
            tel: '15500008888',
            auditor: '李小四',
            mask: true,
            hat: true,
            glove: true,
            cigarette: true,
            phone: true,
            hygiene: true,
            separate: true,
            animal: true,
        }
    }
    RequestData() {
        // 详情
        if (ifedit) {
            var senddata = { code: this.state.editedata.code + "" };
            Http(AlarmGetone, senddata).then(res => {
                if (res.success) {
                    let xScale = parseFloat(parseInt(res.data.pic_w) / 635).toFixed(2);
                    let yScale = parseFloat(parseInt(res.data.pic_h) / 432).toFixed(2);
                    this.setState({
                        handleinfo: res.data.handleinfo,
                        detail: res.data,
                        Rolev: true,
                        xScale,
                        yScale
                    }, () => {
                        setTimeout(() => {
                            this.canvasfun();
                        });
                    })
                }
            })
        }
    }
    canvasfun() {
        let ele = document.getElementById("rollcallObj");
        let ctx = ele.getContext("2d");
        ctx.clearRect(0, 0, 635, 432); //清除画布
        let handleinfo = this.state.handleinfo ? this.state.handleinfo : [];
        handleinfo.map(item => {
            let X = parseFloat(parseInt(item.left) / this.state.xScale).toFixed(2);
            let Y = parseFloat(parseInt(item.top) / this.state.yScale).toFixed(2);
            let W = parseFloat(parseInt(item.width) / this.state.xScale).toFixed(2);
            let H = parseFloat(parseInt(item.height) / this.state.yScale).toFixed(2);
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#F52323';
            ctx.rect(X, Y, W, H);
            ctx.stroke();
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            piddata: nextProps.piddata,
            company: nextProps.company,
        })
        if (nextProps.ifedit !== ifedit) {
            ifedit = nextProps.ifedit;
            if (nextProps.ifedit) {
                this.setState({
                    editedata: nextProps.editedata,
                }, () => {
                    this.RequestData();
                });
            }
        }
    }
    componentDidMount() {
        let _this = this;
    };
    // 取消
    handleCancel() {
        this.props.ificonModal();
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        return (
            <div>
                <Modal
                    title=""
                    visible={this.props.Rolev}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                    className='processDetailModal'
                >
                    <div className='detailWrap'>
                        <div className='detailImage'>
                            <canvas width="635px" height="432px"
                                id="rollcallObj"
                                style={{
                                    backgroundImage: this.state.detail.picpath ? "url(" + `http://${this.state.detail.picpath}` + ") " : '',
                                    backgroundSize: "100% 100%",
                                    backgroundRepeat: "no-repeat"
                                }}
                            />
                        </div>
                        <div className='itemWrap'>
                            <div className='detailItem'>
                                <div className='title'>卫生情况</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("0") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>良好</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>戴口罩</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("1") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>戴帽子</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("2") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>戴手套</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("3") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>香烟</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("4") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>手机</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("5") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>

                            <div className='detailItem'>
                                <div className='title'>生熟分开</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("6") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem detailItemLast'>
                                <div className='title'>小动物</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("7") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='infoItem'>
                                <div className='title'>企业</div>
                                <div className='result' title={this.state.detail.cname}>{this.state.detail.cname}</div>
                            </div>
                            <div className='infoItem'>
                                <div className='title'>地址</div>
                                <div className='result' title={this.state.detail.linkaddress}>{this.state.detail.linkaddress}</div>
                            </div>
                            <div className='infoItem'>
                                <div className='title'>负责人</div>
                                <div className='result' title={this.state.detail.linkmen}>{this.state.detail.linkmen}</div>
                            </div>
                            <div className='infoItem infoItemLast'>
                                <div className='title'>联系方式</div>
                                <div className='result' title={this.state.detail.linktel}>{this.state.detail.linktel}</div>
                            </div>
                            <div className='infoItem'>
                                <div className='title'>审核人</div>
                                <div className='result' title={this.state.detail.handlemen}>{this.state.detail.handlemen}</div>
                            </div>
                            <div className='infoItem infoItemLast'>
                                <div className='title'>审核时间</div>
                                <div className='result' title={this.state.detail.handletime}>{this.state.detail.handletime}</div>
                            </div>
                        </div>
                    </div>

                </Modal>
            </div >
        )
    }
}

export default historyModal
