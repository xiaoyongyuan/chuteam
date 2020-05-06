import React from 'react'
import { Pagination } from 'antd'
export default class MyPagination extends React.Component {
    render() {
        let props = {
            total: this.props.pagination.total ? this.props.pagination.total : 0,
            current: this.props.pagination.current ? this.props.pagination.current : 0,
            pageSize: this.props.pagination.pageSize ? this.props.pagination.pageSize : 12,
            defaultPageSize: 12,
            pageSizeOptions: this.props.pageSizeOptions? this.props.pageSizeOptions:[12, 18, 24, 30],
            showTotal: total => `共${total}条`,
            onChange: (page, pageSize) => {
                this.props.handlePaginationChange({ current: page, pageSize, total: this.props.pagination.total });
            },
            onShowSizeChange:(current,pageSize)=>{
                this.props.handlePaginationChange({ current, pageSize, total: this.props.pagination.total });
            }
        }
        return (
            <div style={{textAlign:'center',marginTop:'20px'}}>
                <Pagination size="small" {...props} showSizeChanger showQuickJumper />
            </div>

        )
    }
}