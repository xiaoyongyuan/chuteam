import React from 'react';
import { Form, Input, Button,message } from 'antd';
import { HttpLogin } from "../../server/login";
import { LOGIN } from "../../config/apiConfig";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import md5 from "js-md5";
import "./login.less";
export default class Login extends React.Component {
    state={
        loading:false
    };
    formRef = React.createRef();
    componentDidMount = () =>{
        sessionStorage.clear()
    };
    /*
    * userpower 0管理员 1组长 2组员
    * */
    onSubmit =(values)=>{
        this.setState({
            loading:true
        });
        HttpLogin(LOGIN,{account:values.username,password:md5(values.password)}).then((res)=>{
            if(res.success == '1'){
                sessionStorage.setItem('token', res.token);
                sessionStorage.setItem('alarm',JSON.stringify({alarmColor:res.alarmcolor,alarmInfo:res.alarminfo}));
                sessionStorage.setItem('user',JSON.stringify(res.data));
                sessionStorage.setItem('power',JSON.stringify(res.power));
                this.setState({
                    loading:false
                });
                if(res.data.userpower == '0' || res.data.userpower == '1'){
                    this.props.history.push("/main/home");
                }else{
                    this.props.history.push("/main/workbench");
                }
            }else{
                message.error(res.errorinfo);
                this.setState({
                    loading:false
                });
            }
        });
    };
    render() {
        let layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        let center = {
            wrapperCol: {
                offset: 4,
                span: 16,
            }
        }
        return (
            <div className='loginWrap'>
                <div className='formWrap'>
                    <div className='formTitle'>
                        <p className='hello'>你好！</p>
                        <p className='welcome'>欢迎登录明厨亮灶值守平台！</p>
                    </div>
                    <Form
                        {...layout}
                        name="basic"
                        hideRequiredMark={true}
                        onFinish={this.onSubmit}
                    >
                        <Form.Item
                            label=""
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的用户名',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined style={{ color: '#cccccc',fontSize:'26px' }} />} placeholder='请输入用户名' className='inputWrap' />
                        </Form.Item>

                        <Form.Item
                            label=""
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的密码',
                                },
                            ]}
                        >
                            <Input.Password visibilityToggle={false} className='inputWrap' prefix={<LockOutlined style={{ color: '#cccccc',fontSize:'26px' }} />} placeholder='请输入密码' />
                        </Form.Item>
                        <Form.Item style={{textAlign:'right'}} {...center}>
                            <Button type="primary" loading={this.state.loading} htmlType="submit" className='btn'>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div >

        )
    }
}