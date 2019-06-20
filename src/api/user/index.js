import {Http} from '@/plugins/http';

// 登录
export const login = (data) => Http.post('/service/user', data);
// 登出
export const logout = () => Http.delete('/service/user');
// 客服列表
export const serviceList = () => Http.get('/service/user/all-service');
// 密码修改
export const rePwd = (data) => Http.put('/service/user/reset-password', data);
