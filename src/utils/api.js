/*封装网络请求*/
/* Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中*/
import axios from "axios";
import { Message } from 'element-ui';
import router from "../router/index";

//success并不是服务端返回的字段, success.data才是服务端返回的数据
//success.status是请求的响应码，success.data.status 是RespBean中自定义的响应码

axios.interceptors.response.use(success => {
  if (success.status && success.status == 200 && success.data.status == 500) {
    Message.error({message: success.data.message})
    return;
  }
  if (success.status && success.status == 200 && success.data.status == 200) {
    Message.success({message: success.data.message})
  }
  return success.data;
}, error => {
  if (error.response.status == 504 || error.response.status == 404) {
    Message.error('服务器被吃了504/404')
  } else if (error.response.status == 403) {
    Message.error('权限不足！')
  } else if (error.response.status == 401) {
    Message.error('尚未登录，请登录！')
    /*后端返回状态码（SecurityConfig）401, 前端要跳转到登录页面*/
    router.replace('/');
  } else {
    if (error.response.data.message) {
      Message.error({message: error.response.data.message})
    } else {
      Message.error('未知错误！后端没有启动或方法出错')
    }
  }
  return;
})

//请求的封装
//登录采用key+value的形式, data就是loginForm对象
//username:***
//password:***

let base = '';
//处理用户登录
export const postKeyValueRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let i in data) {
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
      }
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params
  })
}
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params
  })
}
export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    params: params
  })
}
