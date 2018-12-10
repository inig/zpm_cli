'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  assetsPublicPath: '/dist/',
  NODE_ENV: '"development"'
})
