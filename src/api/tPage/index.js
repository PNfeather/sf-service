import {Http} from '@/plugins/http';

// 获取模板页
export const getTemplatePage = (pageId) => Http.get('/service/template-page', {params: pageId});
// 保存模板页
export const saveTemplatePage = (data) => Http.post('/service/template-page', data);
// 更新模板页
export const updateTemplatePage = (data) => Http.put('/service/template-page', data);
// 删除模板页
export const deleteTemplatePage = (data) => Http.delete('/service/template-page', {params: data});
