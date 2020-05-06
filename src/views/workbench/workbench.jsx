import React from 'react'
import './workbench.less'
import { Button, message, Modal, Breadcrumb, Switch } from 'antd'
import { ExclamationCircleOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { Http } from '../../server/server'
import { ALARM_GETONE_HANDLE, ALARM_HANDLE } from "../../config/apiConfig"
export default class Workbench extends React.Component {
    state = {
        environment: true, //卫生环境
        currentCode: '',  //当前操作的code
        currentType: {},  //当前选择的type
        warningList: [],  //预警列表
        picpath: '', //图片路径
        xScale: 0, // x的比例
        yScale: 0, // y的比例
        startX: -1, //矩形开始的x坐标
        startY: -1, //矩形开始的y坐标
        isDrawing: false,  //当前是否在画图
        companyName: '', //企业名称
        analysisTime: '', //预警分析时间
        location: '', //设备位置
        photoTime: '', //抓图时间
        isShow: true,  // 显示识别按钮
        typeList: [],   //类型数组
        allowNext: false,  //是否可以点击下一条
    }
    addKey = 1;  //添加的key值
    componentDidMount() {
        //设置类型数组
        let { alarmColor, alarmInfo } = JSON.parse(sessionStorage.getItem('alarm'))
        let typeList = []
        alarmInfo.map((item, index) => {
            switch (item) {
                // eslint-disable-next-line no-lone-blocks
                case ('口罩'): {
                    typeList.push({
                        key: index,
                        title: '未戴口罩',
                        color: alarmColor[index]
                    })
                    break;
                };
                // eslint-disable-next-line no-lone-blocks
                case ('帽子'): {
                    typeList.push({
                        key: index,
                        title: '未戴帽子',
                        color: alarmColor[index]
                    })
                    break;
                };
                // eslint-disable-next-line no-lone-blocks
                case ('手套'): {
                    typeList.push({
                        key: index,
                        title: '未戴手套',
                        color: alarmColor[index]
                    })
                    break;
                };
                // eslint-disable-next-line no-lone-blocks
                case ('香烟'): {
                    typeList.push({
                        key: index,
                        title: '香烟',
                        color: alarmColor[index]
                    })
                    break;
                };
                // eslint-disable-next-line no-lone-blocks
                case ('手机'): {
                    typeList.push({
                        key: index,
                        title: '手机',
                        color: alarmColor[index]
                    })
                    break;
                };
                // eslint-disable-next-line no-lone-blocks
                case ('生熟未分'): {
                    typeList.push({
                        key: index,
                        title: '生熟未分',
                        color: alarmColor[index]
                    })
                    break;
                };
                // eslint-disable-next-line no-lone-blocks
                case ('不明生物'): {
                    typeList.push({
                        key: index,
                        title: '不明生物',
                        color: alarmColor[index]
                    })
                    break;
                };
                default: {

                }
            }
        })
        this.setState({
            typeList
        }, () => { this.getInfo() })
        //canvas设置函数
        document.getElementById("myCanvas").addEventListener('mouseup', this.handleMouseup);
        document.getElementById("myCanvas").addEventListener('mousedown', this.handleDown);
        document.getElementById("myCanvas").addEventListener('mousemove', this.handleMove);
    }
    //获取工作台数据
    getInfo = (showMessage=false) => {
        this.addKey = 1;
        Http(ALARM_GETONE_HANDLE).then(res => {
            let xScale = parseFloat(parseInt(res.data.pic_w) / 1015).toFixed(4);
            let yScale = parseFloat(parseInt(res.data.pic_h) / 550).toFixed(4);
            let warningList = []
            res.data.AIinfo.map(item => {
                if (item.tag && item.tag.split(',').length > 1) {
                    warningList.push({
                        key: this.addKey++,   //唯一标识key
                        isDelete: false,  //是否删除
                        X: parseFloat(item.left / xScale).toFixed(4),
                        Y: parseFloat(item.top / yScale).toFixed(4),
                        W: parseFloat(item.width / xScale).toFixed(4),
                        H: parseFloat(item.height / yScale).toFixed(4),
                        typeKeys: item.tag.split(',')
                    })
                } else if (item.tag && item.tag.length == 1) {
                    warningList.push({
                        key: this.addKey++,   //唯一标识key
                        isDelete: false,  //是否删除
                        X: parseFloat(item.left / xScale).toFixed(4),
                        Y: parseFloat(item.top / yScale).toFixed(4),
                        W: parseFloat(item.width / xScale).toFixed(4),
                        H: parseFloat(item.height / yScale).toFixed(4),
                        typeKeys: [item.tag]
                    })
                }
            })
            this.setState({
                currentCode: res.data.code,
                companyName: res.data.cname,
                analysisTime: res.data.AItime,
                location: res.data.location,
                photoTime: res.data.atime,
                picpath: res.data.picpath,
                xScale,
                yScale,
                warningList: warningList,
                allowNext: false,
            }, () => {
                if(showMessage){
                    message.success('获取下一条数据成功')
                }
                this.draw()
            })
        })
    }
    //鼠标事件
    // 鼠标抬起保存
    handleMouseup = (e) => {
        if (this.state.isDrawing) {
            let ele = document.getElementById("myCanvas");
            let canvsclent = ele.getBoundingClientRect();
            let endX = e.clientX - canvsclent.left * (ele.width / canvsclent.width);
            let endY = e.clientY - canvsclent.top * (ele.height / canvsclent.height);
            let warningList = this.state.warningList;
            let X = this.state.startX > endX ? endX : this.state.startX;    //矩形X点
            let Y = this.state.startY > endY ? endY : this.state.startY;    //矩形Y点
            let W = this.state.startX > endX ? this.state.startX - endX : endX - this.state.startX;  //矩形宽
            let H = this.state.startY > endY ? this.state.startY - endY : endY - this.state.startY;  //矩形高
            let newRect = {
                key: this.addKey++,
                typeKeys: [this.state.currentType.key],
                X, Y, W, H,
                isDelete: false,
            }
            warningList.push(newRect)
            this.setState({
                warningList,
                startX: -1,
                startY: -1,
                isDrawing: false,
            }, () => {
                this.draw()
            })
        }
    };
    // 鼠标落下开始画图
    handleDown = (e) => {
        if (this.state.isShow) {
            if (Object.keys(this.state.currentType).length !== 0) {
                let ele = document.getElementById("myCanvas");
                let canvsclent = ele.getBoundingClientRect();
                let startX = e.clientX - canvsclent.left * (ele.width / canvsclent.width);
                let startY = e.clientY - canvsclent.top * (ele.height / canvsclent.height);
                this.setState({
                    startX, startY, isDrawing: true
                })
            } else {
                message.info('请您先选择类型')
            }
        } else {
            message.info('请先开启下方显示识别按钮')
        }


    };
    // 鼠标移动
    handleMove = (e) => {
        this.draw()
        let ele = document.getElementById("myCanvas");
        let ctx = ele.getContext("2d");
        let canvsclent = ele.getBoundingClientRect();
        let x = e.clientX - canvsclent.left * (ele.width / canvsclent.width);
        let y = e.clientY - canvsclent.top * (ele.height / canvsclent.height);
        if (this.state.isDrawing) {
            ctx.save();
            ctx.strokeStyle = this.state.currentType.color ? this.state.currentType.color : '#000';
            ctx.setLineDash([5]);//虚线
            ctx.lineWidth = 3;
            ctx.strokeRect(this.state.startX, this.state.startY, x - this.state.startX, y - this.state.startY);
            ctx.restore();//用来恢复Canvas之前保存的状态
        }
    };
    // 绘制矩形框
    draw = () => {
        let ele = document.getElementById("myCanvas");
        let ctx = ele.getContext("2d");
        ctx.clearRect(0, 0, 1200, 670); //清除画布
        let warningList = this.state.warningList;
        if (this.state.isShow) {
            warningList.map(item => {
                if (!item.isDelete) {
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.setLineDash([]);
                    let color = ''
                    if (item.typeKeys.length > 0) {
                        this.state.typeList.map(i => {
                            if (i.key === parseInt(item.typeKeys[0])) {
                                color = i.color
                            }
                        })
                    }
                    ctx.strokeStyle = color;
                    ctx.rect(item.X, item.Y, item.W, item.H);
                    ctx.stroke();
                    ctx.fillStyle = color;
                    ctx.fillRect(item.X, item.Y, 20, 20);
                    ctx.stroke();
                    ctx.font = '16px bold';
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(item.key, parseFloat(item.X) + 10, parseFloat(item.Y) + 10);
                }
            })
        }
    }
    // 环境卫生的切换函数
    handleChangeEnvironment = value => {
        this.setState({
            environment: value
        })
    }
    // 点击不同类型按钮提示
    handleSelectType = type => {
        message.success(`您选择了‘${type.title}’类型`)
        this.setState({
            currentType: type
        })
    }
    // 预警列表删除单项
    delete = (value, typeKey) => {
        let warningList = this.state.warningList;
        warningList.map(item => {
            if (item.key === value.key) {
                item.typeKeys.splice(item.typeKeys.indexOf(typeKey), 1);
                if (item.typeKeys.length == 0) {
                    item.isDelete = true
                }
            }
        })
        this.setState({
            warningList
        }, () => {
            this.draw();
        })
    }
    // 预警列表删除所有
    deleteAll = () => {
        let warningList = this.state.warningList;
        let allowDelete = warningList.some(item => {
            return !item.isDelete;
        })
        if (allowDelete) {
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '您确定要删除全部吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.setState({
                        warningList: []
                    }, () => { this.draw() })
                }
            })
        } else {
            message.info('没有可以删除的预警')
        }

    }
    // 切换显示识别的按钮
    handleChangeShow = value => {
        this.setState({
            isShow: value
        }, () => { this.draw() })
    }
    //保存提交
    handleSubmit = () => {
        let handleinfo = [];
        let handleobject = [];
        this.state.warningList.map(item => {
            if (!item.isDelete) {
                handleinfo.push({
                    top: Math.round(parseFloat(item.Y) * this.state.yScale),
                    left: Math.round(parseFloat(item.X) * this.state.xScale),
                    width: Math.round(parseFloat(item.W) * this.state.xScale),
                    height: Math.round(parseFloat(item.H) * this.state.yScale),
                    tag: item.typeKeys.join(",")
                })
                item.typeKeys.map(type => {
                    if (handleobject.indexOf(parseInt(type)) == -1) {
                        handleobject.push(parseInt(type))
                    }
                })
            }
        })
        if(!this.state.environment){
            handleobject.unshift(0)
        }
        if(handleinfo.length == 0){
            handleinfo = undefined
        }else{
            handleinfo = JSON.stringify(handleinfo)
        }
        if(handleobject.length == 0){
            handleobject = undefined
        }else{
            handleobject =  handleobject.join(",")
        }
        Http(ALARM_HANDLE, { code: this.state.currentCode, handleinfo , handleobject }).then(res => {
            message.success('保存成功，请点击右下角按钮获取下一条数据')
            this.setState({
                allowNext: true
            })
        })
    }
    render() {
        return (
            <div className='workbenchWrap'>
                <Breadcrumb>
                    <Breadcrumb.Item>工作台</Breadcrumb.Item>
                </Breadcrumb>
                <div className='topWrap'>
                    <div className='canvasWrap'>
                        <canvas width="1015px" height="550px"
                            id="myCanvas"
                            style={{
                                backgroundImage: "url(" + `http://${this.state.picpath}` + ") ",
                                backgroundSize: "100% 100%",
                                backgroundRepeat: "no-repeat"
                            }}
                        />
                    </div>
                    <div className='warningList'>
                        <div className='title'>预警列表</div>
                        <div className='list'>
                            {this.state.warningList.map(item => {
                                if (!item.isDelete) {
                                    let color = ''
                                    if (item.typeKeys.length > 1) {
                                        color = this.state.typeList[parseInt(item.typeKeys[0])].color
                                    }
                                    return <div key={item.key} className='item'>
                                        <div className='index'>{item.key}</div>
                                        <div className='infoWrap'>
                                            {item.typeKeys.map((i, j) => {
                                                let color = ''
                                                let title = ''
                                                this.state.typeList.map(type => {
                                                    if (type.key == i) {
                                                        color = type.color;
                                                        title = type.title;
                                                    }
                                                })
                                                return <div key={i} className='info'>
                                                    <div className='name' style={{ color: color }}>{title}</div>
                                                    <div className='btn' onClick={() => { this.delete(item, i) }}><CloseCircleOutlined style={{ marginRight: "5px" }} />删除</div>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='deleteAll' onClick={this.deleteAll}>删除全部</div>
                    </div>
                </div>
                <div className='bottomWrap'>
                    <div className='info'>
                        <div className='infoItem'><div>企业名称：</div><div>{this.state.companyName}</div></div>
                        <div className='infoItem'><div>预警分析时间：</div><div>{this.state.analysisTime}</div></div>
                        <div className='infoItem'><div>设备位置：</div><div>{this.state.location}</div></div>
                        <div className='infoItem'><div>抓图时间：</div><div>{this.state.photoTime}</div></div>
                        <div className='infoItem'><div>显示识别：</div><div><Switch checked={this.state.isShow} onChange={this.handleChangeShow} /></div></div>
                    </div>
                    <div className='actions'>
                        <div className='typeBtns'>
                            {this.state.typeList.map(item => {
                                return <div key={item.key} className='typeItem'>
                                    <div className='title'>{item.title}</div>
                                    <div className='btn' style={{ backgroundColor: item.color }} onClick={() => { this.handleSelectType(item) }}>添加</div>
                                </div>
                            })}
                            <div className='typeItem'>
                                <div className='title'>环境卫生良好</div>
                                <div className='environmentBtn' style={{ borderColor: this.state.environment ? '#3357DB' : '#cccccc' }} onClick={() => { this.handleChangeEnvironment(true) }}>{this.state.environment ? <CheckOutlined /> : ""}</div>
                            </div>
                            <div className='typeItem'>
                                <div className='title'>环境卫生差</div>
                                <div className='environmentBtn' style={{ borderColor: this.state.environment ? '#cccccc' : '#3357DB' }} onClick={() => { this.handleChangeEnvironment(false) }}>{this.state.environment ? "" : <CheckOutlined />}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Button type='primary' style={{ marginRight: '100px' }} onClick={this.handleSubmit}>保存提交</Button>
                            <Button type='primary' disabled={!this.state.allowNext} onClick={()=>{this.getInfo(true)}}>下一条</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}