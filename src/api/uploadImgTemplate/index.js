import {Http} from '@/plugins/http';

// 导入图片
export const uploadImgTemplate = (data) => Http.post('/service/template-image', data);
