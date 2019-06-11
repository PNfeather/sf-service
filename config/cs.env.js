'use strict'
const devEnv = require('./dev.env')
module.exports = {
  NODE_ENV: '"production"',
  MOCK: 'false',
  BASE_URL: devEnv.BASE_URL
}
