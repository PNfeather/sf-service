import Mock from 'mockjs'; // 引入mockjs

let baseUrl = process.env.BASE_URL;

Mock.mock(baseUrl + '/user/logout', 'post', (options) => {
  console.log(options);
  return {
    'code': 0,
    'data': '1',
    'message': 'success'
  };
}); // 根据数据模板生成模拟数据
