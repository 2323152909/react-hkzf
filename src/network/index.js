import axios from 'axios';

// 封装axios请求实例
export default function request(config){
  const instance = axios.create({
    baseURL:'http://120.79.64.82:9999',
    timeout: 5000
  })

  // 请求拦截器
  instance.interceptors.request.use(request => {
    return request;
  },error => {
    return Promise.reject(error);
  });

  // 响应拦截器
  instance.interceptors.response.use(response => {
    return response;
  },error => {
    return Promise.reject(error);
  });

  return instance(config)
}