'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOCK: 'true',
  // BASE_URL: '"/api"'
  BASE_URL: '"http://10.0.2.188:8088/api/admin"'
})
