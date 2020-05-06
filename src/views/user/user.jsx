import React from 'react';
import { Breadcrumb, Button, Space,message,Modal,Form,Input,Select} from 'antd'
import { EditOutlined,DeleteOutlined,ReloadOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import SearchForm from '../../components/myForm/searchForm'
import MyTable from "../../components/myTable/myTable"
import MyPagination from "../../components/myPagination/myPagination";
import {USERLIST,RESTPASS,DEL,ADDUSER,USERDETAIL,UPDATE} from "../../config/apiConfig";
import {Http} from "../../server/server";
const { confirm } = Modal;
const {Option}=Select;
class User extends React.Component {
    state = {
        data :[],
        pagination: {
            total: "",
            pagesize: 20,
            current: 1
        },
        visible:false,
    };
    searchFormList = [
        {
            type: 'INPUT',
            label: "账号",
            id: 'account',
            placeholder: '请输入账号',
            width: 200,
        },
        {
            type: 'INPUT',
            label: "姓名",
            id: 'name',
            placeholder: '请输入姓名',
            width: 200,
        },
    ]
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => <div className='tableIndex'>{index + 1}</div>,
            width:80
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
            ellipsis: true,
        },
        {
            title: '类型',
            dataIndex: 'userpower',
            key: 'userpower',
            ellipsis: true,
            render:(text)=>{
                if(text=="0"){
                    return "管理员";
                }else if(text=="1"){
                    return "组长";
                }else if(text=="2"){
                    return "组员";
                }
            }
        },
        {
            title: '姓名',
            dataIndex: 'realname',
            key: 'realname',
            ellipsis: true,
        },
        {
            title: '邮箱',
            dataIndex: 'emailaddress',
            key: 'emailaddress',
            ellipsis: true,
        },
        {
            title: '电话',
            dataIndex: 'linktel',
            key: 'linktel',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render:(text, record)=>{
              if(record.userpower == "0" && JSON.parse(sessionStorage.getItem("user")).userpower == "0"){
                    return(
                        <Space size='middle'>
                            <div className='editBtn' title='编辑' onClick={()=>this.editAdd(record)}><EditOutlined /></div>
                            <div className='editBtn' title='重置密码' ><ReloadOutlined onClick={()=>this.resetPass(record)} /></div>
                        </Space>
                    )
                }else if(record.userpower == "0" && JSON.parse(sessionStorage.getItem("user")).userpower == "1"){

                }else if(record.userpower == "1" && JSON.parse(sessionStorage.getItem("user")).userpower == "1"){
                    return(
                        <Space size='middle'>
                            <div className='editBtn' title='编辑' onClick={()=>this.editAdd(record)}><EditOutlined /></div>
                            <div className='editBtn' title='重置密码' ><ReloadOutlined onClick={()=>this.resetPass(record)} /></div>
                        </Space>
                    )
                }else{
                    return(
                        <Space size='middle'>
                            <div className='editBtn' title='编辑' onClick={()=>this.editAdd(record)}><EditOutlined /></div>
                            <div className='editBtn' title='重置密码' ><ReloadOutlined onClick={()=>this.resetPass(record)} /></div>
                            <div className='deleteBtn' title='删除' ><DeleteOutlined onClick={()=>this.delete(record)} /></div>
                        </Space>
                    )
                }
            }
        }
    ];
    formRef = React.createRef();
    componentDidMount() {
        this.getList(this.state.pagination);
    }
    //用户列表
    getList=(data)=>{
        Http(USERLIST,data).then((res)=>{
            let pagination = {};
                pagination.pageSize = res.pagesize ? parseInt(res.pagesize) : 10;
                pagination.current = res.page ? parseInt(res.page) : 1;
                pagination.total = res.totalcount ? parseInt(res.totalcount) : 0;
            this.setState({
                data:res.data,
                pagination
            })
        })
    };
    //重置密码
    resetPass=(data)=>{
        let sessionUser=JSON.parse(sessionStorage.getItem("user")).userpower;
        let ctype=JSON.parse(sessionStorage.getItem("user")).ctype;
        Http(RESTPASS,{code:data.code,ctype:ctype}).then(()=>{
            message.success("密码重置成功！初始密码为：888888");
            if(data.userpower == sessionUser){
                this.props.history.push("/");
            }
        })
    };
    //删除用户
    delete=(data)=>{
        const _this=this;
        confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '您是否删除此用户?',
            onOk() {
                Http(DEL,{code:data.code}).then(()=>{
                    message.success("删除成功！");
                    _this.getList({});
                });
            }
        });
    };
    //用户查询
    handleSearch = values => {
        this.getList({account:values.account,realname:values.name});
    };
    //添加用户 编辑用户
    editAdd=(data)=>{
        if(data !== "add"){
            Http(USERDETAIL,{account:data.account}).then((res)=>{
                this.formRef.current.setFieldsValue({
                    account:  res.data.account,
                    userpower: res.data.userpower,
                    realname:res.data.realname,
                    emailaddress:res.data.emailaddress,
                    linktel:res.data.linktel,
                    usergender:res.data.usergender
                });
               this.formRef.current.validateFields();
            })
        }
        this.setState({
            visible:true,
            modelTitle:data
        });
    };
    //添加、编辑提交
    handleOk=()=>{
        this.formRef.current.validateFields().then(values=>{
            if(this.state.modelTitle === "add"){
                Http(ADDUSER,values).then(()=>{
                    message.success("添加用户成功！");
                    this.getList({});
                    this.formRef.current.resetFields();
                });
            }else{
                let data={
                    code:this.state.modelTitle.code,
                    account: values.account,
                    userpower: values.userpower,
                    realname:values.realname,
                    emailaddress:values.emailaddress,
                    linktel:values.linktel,
                    usergender:values.usergender
                };
                Http(UPDATE,data).then(()=>{
                    this.formRef.current.resetFields();
                    message.success("编辑用户成功！");
                    this.getList({});
                });
            }
        });
        this.setState({
            visible:false
        })
    };
    handleCancel=()=>{
        this.formRef.current.resetFields();
        this.setState({
            visible:false
        })
    };
    //分页
    paginationChange = values => {
        let pagination={};
        pagination.pageindex=values.current;
        pagination.pagesize=values.pageSize;
        this.setState({
            pagination
        },()=>{
            this.getList(pagination);
        });
    };
    render() {
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        return (
            <div className='userSettingWrap'>
                <Breadcrumb>
                    <Breadcrumb.Item>用户</Breadcrumb.Item>
                </Breadcrumb>
                <div className='mySearchFormWrap'>
                    <SearchForm formList={this.searchFormList} buttonText='搜索' handleSearch={this.handleSearch} />
                    <Button onClick={()=>this.editAdd("add")}>添加用户</Button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <MyTable columns={this.columns} data={this.state.data} />
                    <MyPagination pagination={this.state.pagination} handlePaginationChange={this.paginationChange} pageSizeOptions={[10, 20, 30, 40]} />
                </div>
                <Modal
                    title={this.state.modelTitle === "add"?"添加用户":"编辑用户"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <Form
                        {...layout}
                        name="basic"
                        ref={this.formRef}
                    >
                        <Form.Item
                            label="账号"
                            name="account"
                            hasFeedback
                            rules={[
                                { required: true, message: '请输入账号!' },
                                {
                                    pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"),
                                    message: "请输入正确的手机号！"
                                }
                                ]}
                        >
                            <Input maxLength={11} />
                        </Form.Item>

                        <Form.Item
                            label="权限"
                            name="userpower"
                            hasFeedback
                            rules={[{ required: true, message: '请选择权限!' }]}
                        >
                            <Select >
                                {
                                    JSON.parse(sessionStorage.getItem("power")).map((item,index)=>(
                                        <Option value={index.toString()} key={index}>{item}</Option>
                                    ))

                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="姓名"
                            name="realname"
                            hasFeedback
                            rules={[{ required: true, message: '请输入姓名!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="邮箱"
                            name="emailaddress"
                            hasFeedback
                            rules={[
                                    { required: true, message: '请输入邮箱!' },
                                    {
                                        pattern: new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$", "g"),
                                        message: "请输入正确的邮箱格式！"
                                    }
                                ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="联系电话"
                            name="linktel"
                            hasFeedback
                            rules={[
                                { required: true, message: '请输入联系电话!' },
                                {
                                    pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"),
                                    message: "请输入正确的手机号！"
                                }
                                ]}
                        >
                            <Input maxLength={11} />
                        </Form.Item>
                        <Form.Item
                            label="性别"
                            name="usergender"
                            hasFeedback
                            rules={[{ required: true, message: '请选择性别!' }]}
                        >
                            <Select>
                                <Option value="0">女</Option>
                                <Option value="1">男</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default User;