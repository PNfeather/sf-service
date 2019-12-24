import {Http} from '@/plugins/http';

// 任务列表
export const taskList = (data) => Http.post('/service/works/tasks', data);
// 作业列表
export const workList = (data) => Http.post('/service/works/works', data);
// 删除作业
export const deleteWork = (id) => Http.delete('/service/works/' + id);
// 制作作业
export const getWork = (id) => Http.get('/service/works/' + id);
// 发布作业
export const putWork = (id) => Http.put('/service/works/' + id);
// 作业详情
export const workDetail = (id) => Http.get('/service/works/' + id + '/detail');
// 获取作业模板
export const getWorkTemplate = (id) => Http.get('/service/works/' + id + '/template');
// 资源库导入模板
export const postWorkTemplate = (id, pageIds) => Http.post('/service/works/' + id + '/template/v2', pageIds);
// 导入模板删除
export const deleteWrokTemplate = (id, templatePageId) => Http.delete('/service/works/' + id + '/template/' + templatePageId);
