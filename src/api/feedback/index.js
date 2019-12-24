import {Http} from '@/plugins/http';

// 获取反馈列表
export const getList = (data) => Http.post('/admin/feedback/list', data);
// 获取反馈详情
export const getTicklingDetail = (id) => Http.get('/admin/feedback/' + id);
