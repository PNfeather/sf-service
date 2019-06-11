import Mock from 'mockjs'; // 引入mockjs

let baseUrl = process.env.BASE_URL;

Mock.mock(baseUrl + '/user/login', 'post', (options) => {
  let params = JSON.parse(options.body);
  console.log(params);
  return {
    'code': 0,
    'data': '1',
    'message': 'success'
  };
}); // 根据数据模板生成模拟数据
