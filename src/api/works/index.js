import {Http} from '@/plugins/http';

// 作业列表
export const worksList = (data) => Http.post('/works/list', data);
// 删除作业
export const deleteWork = (id) => Http.delete('/works/' + id);
// 制作作业
export const getWork = (id) => Http.get('/works/' + id);
// 发布作业
export const putWork = (id) => Http.put('/works/' + id);
// 作业详情
export const workDetail = (id) => Http.get('/works/' + id + '/detail');
// 获取作业模板
export const getWorkTemplate = (id) => Http.get('/works/' + id + '/template');
// 资源库导入模板
export const postWorkTemplate = (id) => Http.post('/works/' + id + '/template');
// 导入模板删除
export const detailWrokTemplate = (id, templatePageId) => Http.delete('/works/' + id + '/template/' + templatePageId);
