import {Http} from '@/plugins/http';
import qs from 'qs';

// 任务列表
export const worksList = (data) => Http.post('/works/list', data);
