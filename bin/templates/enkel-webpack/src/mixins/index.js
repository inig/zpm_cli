// import * as types from '../store/mutation-types'
// import {RouterUtil} from '../utils/index'
// import jsonp from 'jsonp'

export default {
  methods: {
    isPc () {
      let sUserAgent = navigator.userAgent.toLowerCase()
      let bIsIpad = sUserAgent.match(/ipad/i)
      let bIsIphoneOs = sUserAgent.match(/iphone os/i)
      let bIsMidp = sUserAgent.match(/midp/i)
      let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i)
      let bIsUc = sUserAgent.match(/ucweb/i)
      let bIsAndroid = sUserAgent.match(/android/i)
      let bIsCE = sUserAgent.match(/windows ce/i)
      let bIsWM = sUserAgent.match(/windows mobile/i)
      return !(
        bIsIpad ||
        bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM
      )
    },
    __S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    getUUID (prefix) {
      return (
        (prefix || '') +
        this.__S4() +
        this.__S4() +
        '-' +
        this.__S4() +
        '-' +
        this.__S4() +
        '-' +
        this.__S4() +
        '-' +
        this.__S4() +
        this.__S4() +
        this.__S4()
      )
    },
    isEmptyObject (obj) {
      return (
        !!obj && Object.keys(obj).length === 0 && obj.constructor === Object
      )
    },
    rgbToHex (color) {
      let rgb = color.split(',')
      let r = parseInt(rgb[0].split('(')[1])
      let g = parseInt(rgb[1])
      let b = parseInt(rgb[2].split(')')[0])

      let hex =
        '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
      return hex
    },
    loadScript (url) {
      return new Promise(resolve => {
        let script = document.createElement('script')
        script.type = 'text/javascript'
        if (script.readyState) {
          // IE
          script.onreadystatechange = function () {
            if (
              script.readyState === 'loaded' ||
              script.readyState === 'complete'
            ) {
              script.onreadystatechange = null
              resolve(true)
            }
          }
        } else {
          script.onload = function () {
            resolve(true)
          }
        }
        script.src = url
        document.getElementsByTagName('head')[0].appendChild(script)
      })
    },
    loadStyle (url) {
      return new Promise(resolve => {
        let links = document.getElementsByTagName('link')
        for (let i = 0; i < links.length; i++) {
          if (links[i].href.indexOf(url) > -1) {
            resolve(true)
          }
        }
        let link = document.createElement('link')
        link.type = 'text/css'
        link.rel = 'stylesheet'
        link.href = url
        let head = document.getElementsByTagName('head')[0]
        head.insertBefore(link, head.getElementsByTagName('link')[0] || null)
        resolve(true)
      })
    }
  }
}
