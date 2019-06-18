import {Http} from '@/plugins/http';

// 登录
export const login = (data) => Http.post('/user', data);
// 登出
export const logout = () => Http.delete('/user');
// 客服列表
export const serviceList = () => Http.get('/user/all-service');
