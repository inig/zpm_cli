const path = require('path')
const dist = './'

module.exports = {
  // globDirectory: dist,
  // globPatterns: ['**/*.{html,js,css}'],
  swSrc: './static/js/sw.js',
  swDest: path.join(dist, 'sw.js'),
  importWorkboxFrom: 'disabled',
  importScripts: ['https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js']
  // ,
  // clientsClaim: true,
  // skipWaiting: true
}
