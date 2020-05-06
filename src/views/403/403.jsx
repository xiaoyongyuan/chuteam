import React from 'react';
import { Result, Button } from 'antd'

class NotAuthorized extends React.Component {
    render() {
        return (
            <Result
                status="403"
                title="403"
                subTitle="对不起，您没有权限查看此页面。"
                extra={<Button type="primary" onClick={() => { this.props.history.goBack() }}>返回</Button>}
            />
          )
    }
}

export default NotAuthorized;
