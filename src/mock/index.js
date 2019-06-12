// require('@/mock/example');

// 用户模块
require('./user/login');
require('./user/logout');
require('./user/all-service');

const Mock = require('mockjs');

Mock.setup({
  timeout: '200-600'
});
