import {Http} from '@/plugins/http';

// 导入图片
export const uploadImgTemplate = (data) => Http.post('/service/template-image', data);
// 修改图片
export const changeTemplateImg = (data) => Http.put('/service/template-image', data);
// 删除图片
export const deleteTemplateImg = (data) => Http.delete('/service/template-image', {params: data});
