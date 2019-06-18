import Mock from 'mockjs'; // 引入mockjs

let baseUrl = process.env.BASE_URL;

Mock.mock(baseUrl + '/user', 'post', (options) => {
  let params = JSON.parse(options.body);
  console.log(params);
  return {
    'code': 0,
    'data': {
      'account': '14566663',
      'avatarUrl': require('@IMG/default.jpg'),
      'id': 123123,
      'mobile': '13812345678',
      'name': '紫羽',
      'nickName': '紫羽',
      'password': '********',
      'status': 0,
      'userType': 0
    },
    'message': 'success'
  };
}); // 根据数据模板生成模拟数据
