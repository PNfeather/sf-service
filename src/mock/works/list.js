import Mock from 'mockjs'; // 引入mockjs

let baseUrl = process.env.BASE_URL;

const Random = Mock.Random;

let list = []; // 用于接受生成数据的数组
let total = 225;
for (let i = 0; i < total; i++) { // 可自定义生成的个数
  let template = {
    'assignTeacher': Random.name(),
    'assignTime': '2019-6',
    'className': '五一',
    'serviceName': '客服1',
    'status': 0,
    'workId': Random.integer(10000, 99999),
    'workName': '练习册'
  };
  list.push(template);
}

Mock.mock(baseUrl + '/works/list', 'post', (options) => {
  let params = JSON.parse(options.body);
  let skip = params.skip;
  let limit = params.limit;
  let start = skip;
  let end = (skip - 0) + (limit - 0);
  let result = [];
  (start < 0) && (start = 0);
  (end > list.length - 1) && (end = list.length);
  for (let i = start; i < end; i++) {
    result.push(list[i]);
  }
  return {
    'code': 0,
    'data': result,
    'message': 'success',
    'page': 0,
    'pageCount': 0,
    'pageSize': 0,
    'total': total
  };
}); // 根据数据模板生成模拟数据
