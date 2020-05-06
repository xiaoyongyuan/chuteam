import React from 'react';
import "./main.less"
import { Menu, Popover, Button, Modal, Form, Input,Avatar } from 'antd';
import * as Icon from '@ant-design/icons';
import screenfull from 'screenfull';
import MenuConfig from "../../config/menuConfig"
import {connect} from "react-redux";
import {titleCount} from "../../redux/action";
import MyRouter from "../../routes"
import {Http} from "../../server/server";
import {UNP, UPDATEPASS} from "../../config/apiConfig";
import md5 from "js-md5";
const { SubMenu } = Menu;
class Main extends React.Component {
    formRef = React.createRef();
    state = {
        openKeys: [],
        rootSubmenuKeys: [],
        selectedKeys: [],
        showModal: false, //是否显示修改密码弹窗
        collapsed: false,
        fullScreen: false, // 是否全屏
        usertype:""
    };
    // 左侧菜单切换函数
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    componentDidMount = () => {
        let rootSubmenuKeys = [];
        MenuConfig.menuList.map(item => {
            if (item.children) {
                rootSubmenuKeys.push(item.key)
            }
        });
        this.setState({rootSubmenuKeys});
        this.unprocessed();
        this.timer=setInterval(()=>this.unprocessed(),60000);
    };
    //未处理数
    unprocessed=()=>{
        Http(UNP,{},false).then((res)=>{
            this.props.titlenum(res.data);
            this.setState({
                unCount:res.data
            })
        })
    };
    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };
    // 退出登录函数
    logout = () => {
        Modal.confirm({
            title: '提示',
            icon: React.createElement(Icon["ExclamationCircleOutlined"]),
            content: '确定要退出系统吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.props.history.push("/")
            }
        });
    }
    //全屏
    screenFull = () => {
        screenfull.toggle();
        let fullScreen = !this.state.fullScreen;
        this.setState({
            fullScreen
        })
    };
    //修改密码弹窗
    showModal = () => {
        this.setState({
            showModal: true
        })
    }
    handleModalCancel = () => {
        this.formRef.current.resetFields();
        this.setState({
            showModal: false
        })
    };
    handleModalOk = () => {
        this.formRef.current.validateFields().then(values=>{
            let account=JSON.parse(sessionStorage.getItem("user")).account;
            let data={
                account:account,
                oldpassword:md5(values.oldpassword),
                password:md5(values.newPassword)
            };
            Http(UPDATEPASS,data).then(()=>{
                this.setState({
                    showModal:false
                });
                this.formRef.current.resetFields();
                this.props.history.push("/");
            });
        });
    }
    // 渲染菜单
    renderMenu = () => {
        let type = JSON.parse(sessionStorage.getItem('user')).userpower;
        return MenuConfig.menuList.map(item => {
            if (item.rank.indexOf(type) > -1) {
                if (item.children) {
                    return <SubMenu
                        key={item.key}
                        title={
                            <span>
                                {React.createElement(Icon[item.icon])}
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {item.children.map(i => {
                            return <Menu.Item key={i.key} onClick={() => { this.props.history.push(i.key) }}>{i.title}</Menu.Item>
                        })}
                    </SubMenu>
                } else {
                    return <Menu.Item key={item.key} onClick={() => { this.props.history.push(item.key) }}>{React.createElement(Icon[item.icon] ? Icon[item.icon] : "span", {}, null)}<span>{item.title}</span></Menu.Item>
                }
            }
        })
    };
    headerName=()=>{
        let typeText="";
        let usertype = JSON.parse(sessionStorage.getItem('user')).userpower;
        if(usertype=="0"){
            typeText="管理员";
        }else if(usertype=="1"){
            typeText="组长";
        }else if(usertype=="2"){
            typeText="组员";
        }
        return typeText;
    };
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div className='mainWrap'>
                <div className='leftWrap'>
                    <div className='logoWrap'>
                        <div className={this.state.collapsed ? "" : "logobg"} />
                    </div>
                    <Menu
                        mode="inline"
                        openKeys={this.state.openKeys}
                        onOpenChange={this.onOpenChange}
                        selectedKeys={[this.props.history.location.pathname]}
                        inlineCollapsed={this.state.collapsed}
                    >
                        {this.renderMenu()}
                    </Menu>
                </div>
                <div className='rightWrap'>
                    <div className='headerWrap'>
                        <div className="headerCenter">
                            <div onClick={this.toggleCollapsed} style={{ margin: '0px 10px', fontSize: 22, cursor: 'pointer' }}>
                                {this.state.collapsed ? React.createElement(Icon["MenuUnfoldOutlined"]) : React.createElement(Icon["MenuFoldOutlined"])}
                            </div>
                            明厨亮灶联网服务中心
                        </div>
                        <div className="headerRight">
                            <div className='notApproved'>剩未审核：<span>{this.state.unCount}</span></div>
                            <div className='fullScreen' onClick={this.screenFull}>
                                {this.state.fullScreen ? React.createElement(Icon["FullscreenExitOutlined"]) : React.createElement(Icon["FullscreenOutlined"])}
                            </div>
                            <Popover className='userInfo' placement="bottom" title="" content={
                                <div>
                                    <div style={{ marginBottom: '5px' }} onClick={this.showModal}><Button>修改密码</Button></div>
                                    <div><Button onClick={this.logout}>退出系统</Button></div>
                                </div>
                            }>
                                <Avatar icon={React.createElement(Icon["UserOutlined"])} className='avatar'/>
                                <div className='username'>
                                    <div className='name'>{JSON.parse(sessionStorage.getItem('user')).realname} </div>
                                    <div className='type'>{this.headerName()} </div>
                                </div>
                                <div style={{ fontSize: '20px' }}>
                                    {React.createElement(Icon["CaretDownOutlined"])}
                                </div>
                            </Popover>
                        </div>
                    </div>
                    <div className="contentWrap">
                        <MyRouter />
                    </div>
                </div>
                <Modal
                    title="修改密码"
                    visible={this.state.showModal}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    maskClosable={false}
                >
                    <Form
                        {...formItemLayout}
                        name="changePwd"
                        ref={this.formRef}
                    >
                        <Form.Item
                            name="oldpassword"
                            label="原密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入原密码',
                                },
                                {
                                    min: 6,
                                    message: '密码至少6位',
                                },
                                {
                                    max: 12,
                                    message: '密码至多12位',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="新密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入新密码',
                                },
                                {
                                    min: 6,
                                    message: '密码至少6位',
                                },
                                {
                                    max: 12,
                                    message: '密码至多12位',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('oldPassword') === value) {
                                            return Promise.reject('新密码与原密码相同，请检查');
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                }),
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="确认密码"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: '请确认密码',
                                },
                                {
                                    min: 6,
                                    message: '密码至少6位',
                                },
                                {
                                    max: 12,
                                    message: '密码至多12位',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject('您两次输入的密码不同，请检查');
                                        }
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Form>
                </Modal>
            </div >
        )
    }
}
const mapStateToProps = state=>({

});
const mapDispatchToProps=(dispatch)=>({
    titlenum:(num)=>dispatch(titleCount(num))
});
export default connect(mapStateToProps,mapDispatchToProps)(Main);