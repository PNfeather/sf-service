'use strict'
const devEnv = require('./dev.env')
module.exports = { // 已放弃使用
  NODE_ENV: '"production"',
  MOCK: 'false',
  // BASE_URL: '"http://10.0.2.252:8080/api"',
  BASE_URL: '"https://devapi.ecaiedu.com/api"',
  CJIMGURL: '"https://cjfc-dev.oss-cn-shenzhen.aliyuncs.com/"'
}
