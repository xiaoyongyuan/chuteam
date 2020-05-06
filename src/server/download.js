import axios from 'axios'
import { message } from 'antd'
export const HttpDownLoad = (url,fileName,data = {}) => {
    axios({
        method: 'GET',
        headers: {
            "pragma": "no-cache",
            'Content-type': 'application/json;charset=UTF-8',
            'Authorization': sessionStorage.getItem('token')
        },
        url: url,
        params: data,
        timeout: 10000,
        responseType: 'blob'
    }).then(res => {
        let blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel'      //将会被放入到blob中的数组内容的MIME类型 
        });
        let objectUrl = URL.createObjectURL(blob);  //生成一个url
        let dom = document.createElement('a')//设置一个隐藏的a标签，href为输出流，设置download
        dom.style.display = 'none'
        dom.href = objectUrl
        dom.setAttribute('download', fileName)//指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
        document.body.appendChild(dom)
        dom.click()
    })
        .catch(err => {
            console.log(err);
            message.error('下载文件失败')
        })
}