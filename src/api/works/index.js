import {Http} from '@/plugins/http';

// 任务列表
export const worksList = (data) => Http.post('/works/list', data);
// 删除任务
export const deleteWork = (id) => Http.delete('/works/' + id);
