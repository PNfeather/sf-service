import {Http} from '@/plugins/http';

// 新增模板书
export const createBook = (data) => Http.post('/service/template-books', data);
// 新增模板书
export const updateBook = (data) => Http.post('/service/template-books/update', data);
// 获取模板书
export const getBookTemplate = (bookId) => Http.get('/service/template-books/' + bookId);
// 发布模板书
export const releaseBook = (bookId) => Http.put('/service/template-books/' + bookId + '/release');
// 查看模板书
export const reviewBook = (bookId) => Http.get('/service/template-books/' + bookId + '/review');
// 模板书列表
export const getBookList = (data) => Http.post('/service/template-books/list', data);
// 更新模板页序号
export const upadataTemplateSerialNum = (bookId, type, param) => Http.put('/service/' + (type == 'book' ? 'template-books' : 'works') + '/' + bookId + '/serial-number', param);
