import Mock from 'mockjs'; // 引入mockjs

let baseUrl = process.env.BASE_URL;

const Random = Mock.Random;

let list = []; // 用于接受生成数据的数组
let total = 8;
for (let i = 0; i < total; i++) { // 可自定义生成的个数
  let template = {
    'account': '14566663',
    'avatarUrl': require('@IMG/default.jpg'),
    'id': 123123,
    'mobile': '13812345678',
    'name': Random.cname(),
    'nickName': '紫羽',
    'password': '********',
    'status': 0,
    'userType': 0
  };
  list.push(template);
}

Mock.mock(baseUrl + '/user/all-service', 'get', (options) => {
  let params = JSON.parse(options.body);
  console.log(params);
  return {
    'code': 0,
    'data': list,
    'message': 'success'
  };
}); // 根据数据模板生成模拟数据
