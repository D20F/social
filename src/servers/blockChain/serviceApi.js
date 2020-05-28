import axios from 'axios';

var baseURL
if (process.env.NODE_ENV === 'development') {
    // baseURL = 'http://api.poggy.org';
    baseURL = 'http://112.74.165.87'
} else {
    baseURL = 'http://api.poggy.org';
    // baseURL = 'http://122.115.73.23'; // POG测试API地址
}
const xhr = axios.create({
    baseURL,
    timeout: 10000,
});

// post请求,needHeader参数用于判断是否需要认证
const postData = (url, data, needHeader) => {
    let headers = {};
    if (needHeader) {
        headers = {
            token: localStorage.getItem('token')
        }
    }
    return new Promise((resolve, reject) => {
        xhr({ url, data, headers, method: 'post' })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => reject(err))
    })
}

// get请求,needHeader参数用于判断是否需要认证
const getData = (url, params, needHeader) => {
    let headers = {};
    if (needHeader) {
        headers = {
            token: localStorage.getItem('token')
        }
    }
    return new Promise((resolve, reject) => {
        xhr({ url, params, headers })
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    })
}

// 获取POG转账记录
const getPogTransfers = (reqData) => {
    const url = '/account/transfer_record/search';
    const data = reqData;
    return getData(url, data);
}

export default {
    getPogTransfers,
}