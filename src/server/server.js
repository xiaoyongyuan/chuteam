import axios from 'axios'
import { message } from 'antd'
export const Http = (url, data={}, showLoading = true) => {
    let loading
    if (showLoading) {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'block'
    }
    let token = sessionStorage.getItem('token')
    if (!token || token === undefined || token === "") {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'none'
        message.warn('登录状态超时，请重新登录');
        window.location.href = "#/";
    }
    data.comid= JSON.parse(sessionStorage.getItem('user')).companycode;
    data.user = JSON.parse(sessionStorage.getItem('user')).account;
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                'Authorization': token,
            },
            url: url,
            data: data,
            timeout: 10000,
        }).then((res) => {
            if (showLoading) {
                loading = document.getElementById('ajaxLoading')
                loading.style.display = 'none'
            }
            if (res && res.status == '200' && res.data.success == 1) {
                resolve(res.data)
            } else {
                if (res.data.success == 2) {
                    message.warn('登录状态超时，请重新登录');
                    window.location.href = "#/";
                } else {
                    message.warn(res.data.errorinfo)
                    reject(res.msg)
                }
            }
        }).catch((err) => {
            if (showLoading) {
                loading = document.getElementById('ajaxLoading')
                loading.style.display = 'none'
            }
            message.warn('系统问题，请联系管理人员')
        })
    })
}