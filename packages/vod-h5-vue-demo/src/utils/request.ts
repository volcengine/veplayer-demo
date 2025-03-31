/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建axios实例
const service = axios.create({
  baseURL: __API_BASE_URL__,
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前可以做些什么
    console.log('Request config:', config.url, config.baseURL, config.method, config.data);
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Complete Response:', response);
    const res = response.data;
    console.log('Response data:', response.status, res);

    // 如果响应状态码不是200，则认为请求出错
    if (response.status !== 200) {
      console.error('API error:', res.message || 'Error');
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      // 检查响应是否有正确的格式
      return res;
      // if (res.code === 0) {
      //   return res; // 返回完整响应，包含code, message, data等字段
      // } else {
      //   console.error('API business error:', res.message || 'Error', res.code);
      //   return Promise.reject(new Error(res.message || 'Error'));
      // }
    }
  },
  error => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  },
);

// 封装请求方法
export default {
  get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config });
  },
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },
  delete<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config });
  },
};
