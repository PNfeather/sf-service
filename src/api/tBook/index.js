import {Http} from '@/plugins/http';

// 新增模板书
export const createBook = () => Http.post('/template-books');
// 新增模板书
export const getBookTemplate = (bookId) => Http.get('/template-books/' + bookId);
// 发布模板书
export const releaseBook = (bookId) => Http.put('/template-books/' + bookId + '/release');
// 查看模板书
export const reviewBook = (bookId) => Http.get('/template-books/' + bookId + '/release');
// 模板书列表
export const getBookList = (data) => Http.post('/template-books/list', data);
