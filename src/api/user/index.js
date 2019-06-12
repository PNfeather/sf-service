import {Http} from '@/plugins/http';
import qs from 'qs';

// 登录
export const login = data => Http.post('/user/login', data);
// 登出
export const logout = (data) => Http.post('/user/logout', qs.stringify(data));
// 客服列表
export const serviceList = () => Http.get('/user/all-service');
