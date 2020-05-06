import React from 'react';
import { Result,Button } from 'antd'

class Notfound extends React.Component {
    render() {
        return (
            <Result
            status="404"
            title="404"
            subTitle="对不起，没有找到此页面。"
            extra={<Button type="primary" onClick={()=>{this.props.history.goBack()}}>返回</Button>}
          />
          )
    }
}

export default Notfound;