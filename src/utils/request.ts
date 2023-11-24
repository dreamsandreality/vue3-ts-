import axios from "axios";
import { AxiosInstance,AxiosError } from 'axios'
import {ElMessage} from 'element-plus'
const instance:AxiosInstance = axios.create({
  baseURL:'/api',
  timeout: 5000
})

const MessageNotice = (error:string) => {
  ElMessage.error(error)
}

// 错误处理函数
const ErrorHandler = (status:number,info:string) => {
  switch(status){
    case 400:
        console.log("400-表示请求报文中存在语法错误");
        MessageNotice('400-请求出错')
        break;
    case 401:
        console.log("401-未经许可，需要通过HTTP认证");
        MessageNotice('401-登录超时')
        break;
    case 403:
        console.log("403-服务器拒绝该次访问（访问权限出现问题）");
        MessageNotice('403-服务器拒绝该次访问')
        break;
    case 404:
        console.log("404-表示服务器上无法找到请求的资源");
        ElMessage.error('404-服务器上无法找到请求的资源')
        break;
    case 500:
        console.log("500-表示服务器在执行请求时发生了错误");
        MessageNotice('500-服务器出错')
        break;
    case 503:
        console.log("503-表示服务器暂时处于超负载或正在进行停机维护");
        MessageNotice('503-服务器出错')
        break;
    case 504:
        console.log("504-（网关超时）  服务器作为网关或代理，但是没有及时从上游服务器收到请求");
        MessageNotice('504-网关超时')
        break;
    default:
        console.log(info);
        break;
}
}

// 添加请求拦截器
instance.interceptors.request.use((config)=>{
  return config
},(err:AxiosError)=>{
  return Promise.reject(err)
})

// 添加响应拦截器
instance.interceptors.response.use((res)=>{
  return res
},(err)=>{
  console.log('error',err)
  const {response}= err
  ErrorHandler(response.status,response.info)
})


export default instance