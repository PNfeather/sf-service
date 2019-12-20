import {Http} from '@/plugins/http';

// 查询所有学校
export const schoolList = () => Http.get('/base-data/list-all-schools');
// 查询所有年级
export const gradeList = () => Http.get('/base-data/list-all-grades');
// 根据学校年级查询班级
export const classesList = (school, grade) => Http.get('/base-data/list-classes/' + school + '/' + grade);
