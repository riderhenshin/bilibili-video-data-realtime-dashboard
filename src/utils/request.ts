import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 1. 创建 Axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 环境变量（区分开发/生产）
  timeout: 5000, // 超时时间（根据需求调整）
  headers: {
    'Content-Type': 'application/json;charset=utf-8', // 默认请求头
  },
});

// 2. 请求拦截器（可选：添加 token、修改请求参数等）
service.interceptors.request.use(
  (config) => {
    console.log('[Request 生效] 请求拦截器触发，请求地址：', config.url); // 新增日志
    // 示例：添加用户 Token（若项目有登录功能）
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }    
    return config;
  },
  (error: AxiosError) => {
    // 请求错误立即 reject
    return Promise.reject(error);
  }
);

// 3. 响应拦截器（统一处理响应、错误）
service.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[Request 生效] 响应拦截器触发，响应数据：', response.data); // 新增日志
    const { data } = response;
    // 按 Mock Server 响应格式（{ code: 200, data: [], msg: 'success' }）处理
    if (data.code === 200) {
      // 成功：直接返回 data（简化 Pinia 中取值）
      return data.data;
    } else {
      // 业务错误（如 code=400/500）：提示错误并 reject
      console.error('业务错误:', data.msg);
      return Promise.reject(new Error(data.msg || '接口响应错误'));
    }
  },
  (error: AxiosError) => {
    // 网络错误（如超时、404、500）：统一提示
    let errorMsg = '网络异常，请稍后重试';
    if (error.response) {
      // 状态码错误（如 404：接口不存在，500：服务端错误）
      switch (error.response.status) {
        case 404:
          errorMsg = '请求接口不存在';
          break;
        case 500:
          errorMsg = '服务端错误，请联系管理员';
          break;
        default:
          errorMsg = `请求错误: ${error.response.status}`;
      }
    } else if (error.request) {
      // 请求已发送但无响应（如超时）
      errorMsg = '请求超时，请检查网络';
    }
    console.error('网络错误:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

// 4. 封装请求函数（支持 GET/POST 等，TS 类型约束）
const request = {
  // GET 请求
  get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return service.get(url, { params });
  },
  // POST 请求（如需可添加，当前 Mock 均为 GET）
  post<T>(url: string, data?: Record<string, any>): Promise<T> {
    return service.post(url, data);
  },
};

export default request;