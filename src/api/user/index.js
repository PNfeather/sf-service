import {Http} from '@/plugins/http';

// 登录
export const login = data => Http.post('/user/login', data);
// 登出
export const logout = () => Http.get('/user/logout');
