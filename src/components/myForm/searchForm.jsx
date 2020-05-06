import React from 'react'
import { Form, Button, Input, Select, InputNumber, Checkbox, DatePicker, TimePicker, Switch } from 'antd'
const { Option } = Select;
const { RangePicker } = DatePicker;
export default class SearchForm extends React.Component {
    state = {
        formItems: [],
        initialValues: {}
    }
    formRef = React.createRef();
    componentDidMount = () => {
        let formItems = [];
        let initialValues = {}
        this.props.formList.map(v => {
            if (v.initialValue) {
                initialValues[v.id] = v.initialValue
            }
            if (v.type === 'INPUT') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <Input placeholder={v.placeholder ? v.placeholder : ''} style={{ width: v.width ? v.width : 150 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'SELECT') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <Select placeholder={v.placeholder ? v.placeholder : ''} style={{ width: v.width ? v.width : 150 }}>
                        {v.list.map(i => {
                            return <Option value={i.value} key={i.value}>{i.name}</Option>
                        })}
                    </Select>
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'INPUTNUMBER') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <InputNumber placeholder={v.placeholder ? v.placeholder : ''} style={{ width: v.width ? v.width : 150 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'CHECKBOX') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    valuePropName="checked"
                >
                    <Checkbox >{v.label}</Checkbox>
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'DATE') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <DatePicker showTime={v.showTime ? v.showTime : false} style={{ width: v.width ? v.width : 220 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'DATES') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <RangePicker showTime={v.showTime ? v.showTime : false} style={{ width: v.width ? v.width : 360 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'TIME') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <TimePicker style={{ width: v.width ? v.width : 100 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'YEAR') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <DatePicker picker='year' style={{ width: v.width ? v.width : 100 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'MONTH') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <DatePicker picker='month' style={{ width: v.width ? v.width : 120 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'WEEK') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <DatePicker picker='week' style={{ width: v.width ? v.width : 120 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'QUARTER') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                >
                    <DatePicker picker='quarter' style={{ width: v.width ? v.width : 120 }} />
                </Form.Item>
                formItems.push(item);
            } else if (v.type === 'SWITCH') {
                let item = <Form.Item
                    key={v.id}
                    name={v.id}
                    label={v.label}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                formItems.push(item);
            }
        })
        this.setState({
            formItems,
            initialValues
        }, () => {
            this.formRef.current.resetFields();
        })
    }
    handleSubmit = (values) => {
        this.props.handleSearch(values)
    }
    render() {
        return (
            <Form
                layout='inline'
                ref={this.formRef}
                initialValues={this.state.initialValues}
                onFinish={this.handleSubmit}
            >
                {this.state.formItems}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='searchBtn'>{this.props.buttonText ? this.props.buttonText : '搜索'}</Button>
                </Form.Item>
            </Form>
        )
    }
}