// require('@/mock/example');

// 用户模块
require('./user/login');
require('./user/logout');
require('./user/all-service');

// 任务模块
require('./task/list');

const Mock = require('mockjs');

Mock.setup({
  timeout: '200-600'
});
