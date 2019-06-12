import {Http} from '@/plugins/http';
import qs from 'qs';

// 任务列表
export const taskList = (data) => Http.post('/task/list', qs.stringify(data));
