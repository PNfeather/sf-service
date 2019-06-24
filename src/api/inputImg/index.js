import {Http} from '@/plugins/http';

// 导入图片
export const inputImg = (data) => Http.post('/service/template-image', data);
