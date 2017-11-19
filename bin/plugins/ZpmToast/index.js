/***
 **                                                          _ooOoo_
 **                                                         o8888888o
 **                                                         88" . "88
 **                                                         (| -_- |)
 **                                                          O\ = /O
 **                                                      ____/`---'\____
 **                                                    .   ' \\| |// `.
 **                                                     / \\||| : |||// \
 **                                                   / _||||| -:- |||||- \
 **                                                     | | \\\ - /// | |
 **                                                   | \_| ''\---/'' | |
 **                                                    \ .-\__ `-` ___/-. /
 **                                                 ___`. .' /--.--\ `. . __
 **                                              ."" '< `.___\_<|>_/___.' >'"".
 **                                             | | : `- \`.;`\ _ /`;.`/ - ` : | |
 **                                               \ \ `-. \_ __\ /__ _/ .-` / /
 **                                       ======`-.____`-.___\_____/___.-`____.-'======
 **                                                          `=---='
 **
 **                                       .............................................
 **                                              佛祖保佑             永无BUG
 **                                      佛曰:
 **                                              写字楼里写字间，写字间里程序员；
 **                                              程序人员写程序，又拿程序换酒钱。
 **                                              酒醒只在网上坐，酒醉还来网下眠；
 **                                              酒醉酒醒日复日，网上网下年复年。
 **                                              但愿老死电脑间，不愿鞠躬老板前；
 **                                              奔驰宝马贵者趣，公交自行程序员。
 **                                              别人笑我忒疯癫，我笑自己命太贱；
 **                                              不见满街漂亮妹，哪个归得程序员？
 */
/**
 * Created by liangshan on 2017/11/17.
 */
let subTemplate = '<div class="zpm-toast-inner {{{POSITION}}} {{{TYPE}}} {{{SHOWN}}}"><text class="toast-content">{{{CONTENT}}}</text></div>'
const template = `<div id="{{{ID}}}">${subTemplate}</div>`
function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
function getUUID () {
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
function getTemplate (opts) {
  return template.replace(/{{{ID}}}/, opts.id)
    .replace(/{{{CONTENT}}}/, opts.content)
    .replace(/{{{POSITION}}}/, opts.position)
    .replace(/{{{TYPE}}}/, opts.type)
    .replace(/{{{SHOWN}}}/, opts.shown ? 'shown' : 'hidden')
}
function isEmptyObj (obj) {
  var t
  for (t in obj)
    return !1
  return !0
}
function getSubTemplate (opts) {
  return subTemplate.replace(/{{{CONTENT}}}/, opts.content)
    .replace(/{{{POSITION}}}/, opts.position)
    .replace(/{{{TYPE}}}/, opts.type)
    .replace(/{{{SHOWN}}}/, opts.shown ? 'shown' : 'hidden')
}
function getStyles (opts) {
  let outStyle = `
      @-webkit-keyframes toastFadeIn {
          0% {
              opacity: 0;
          }
          100% {
              opacity: 1;
          }
      }
      @keyframes toastFadeIn {
          0% {
              opacity: 0;
          }
          100% {
              opacity: 1;
          }
      }
      @-webkit-keyframes toastFadeOut {
          0% {
              opacity: 1;
          }
          100% {
              opacity: 0;
          }
      }
      @keyframes toastFadeOut {
          0% {
              opacity: 1;
          }
          100% {
              opacity: 0;
          }
      }
      #${opts.id} { 
        position: fixed; 
        left: 0; 
        top: 0; 
        z-index: 999999; 
        width: 100%; 
        height: 100%;      
        color: ${opts.color || '#FFFFFF'}; 
        font-size: 30px;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #${opts.id} .zpm-toast-inner {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        font-size: 13px;
        line-height: 20px;
        font-weight: 300;
        text-align: justify;       
      }
      #${opts.id} .zpm-toast-inner.top {
        position: absolute;
        top: 0;
      }
      #${opts.id} .zpm-toast-inner.center {
        max-width: 60%;
        border-radius: 5px;
        width: auto;
      }
      #${opts.id} .zpm-toast-inner.bottom {
        position: absolute;
        bottom: 0;
      }
      #${opts.id} .zpm-toast-inner.shown {
        animation: toastFadeIn .2s linear;
        animation-delay: .1s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
      }
      #${opts.id} .zpm-toast-inner.hidden {
        animation: toastFadeOut .2s linear;
        animation-delay: .1s;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
      }
      #${opts.id} .zpm-toast-inner.black {
        background-color: ${opts.bgColor || 'rgba(0, 0, 0, 0.9)'};
      }
      #${opts.id} .zpm-toast-inner.success {
        background-color: ${opts.bgColor || 'rgba(92, 184, 92, .9)'};
      }
      #${opts.id} .zpm-toast-inner.info {
        background-color: ${opts.bgColor || 'rgba(91, 192, 222, .9)'};
      }
      #${opts.id} .zpm-toast-inner.warning {
        background-color: ${opts.bgColor || 'rgba(240, 173, 78, .9)'};
      }
      #${opts.id} .zpm-toast-inner.error {
        background-color: ${opts.bgColor || 'rgba(217, 83, 79, .9)'};
      }
    `
  return outStyle
}
function addStyles (opts) {
  let str = getStyles(opts)
  let sty = document.querySelector(`#style-${opts.id}`)
  if (!sty) {
    sty = document.createElement('style')
    sty.type = 'text/css'
    sty.id = `style-${opts.id}`
    if (sty.styleSheet) {
      sty.styleSheet.cssText = str
    } else {
      sty.innerHTML = str
    }
    document.getElementsByTagName('head')[0].appendChild(sty)
  } else {
    if (sty.styleSheet) {
      sty.styleSheet.cssText = str
    } else {
      sty.innerHTML = str
    }
  }
}
function addTemplate (opts, vueInstance) {
  /**
   * 加上一个timeout，用于保证vue生命周期的created钩子函数中也能调用该插件的方法。
   */
  setTimeout(function () {
    if (vueInstance._isMounted) {
      document.body.innerHTML += getTemplate(opts)
    }
  }, 0)
}
function replaceSubTemplate (opts) {
  setTimeout(function () {
    document.querySelector(`#${opts.id}`).innerHTML = getSubTemplate(opts)
  }, 0)
}
let ZpmToast = {}
ZpmToast.install = function (Vue, opts) {
  const that = this
  if (ZpmToast.installed) return

  let toastId = `zpm-toast-${getUUID()}`
  that.zpmToast = {}

  let options = Object.assign({
    root: '#root', // 暂时没用
    type: 'success',
    position: 'center',
    content: '提示',
    duration: 3000,
    bgColor: '',
    color: ''
  }, opts, {
    id: toastId
  })
  Vue.prototype.showToast = function (params) {
    const vueInstance = this
    Object.assign(options, {
      bgColor: '',
      color: ''
    }, params, {
      shown: true
    })
    if (isEmptyObj(that.zpmToast)) {
      Object.assign(that.zpmToast, {
        shown: true,
        id: toastId,
        timeout: null
      })
      addStyles(options)
      addTemplate(options, vueInstance)
    } else {
      Object.assign(that.zpmToast, {
        shown: true
      })
      addStyles(options)
      replaceSubTemplate(options)
    }

    if (that.zpmToast.timeout) {
      clearTimeout(that.zpmToast.timeout)
    }
    that.zpmToast.timeout = setTimeout(function () {
      hideToast()
    }, options.duration)
  }
  const hideToast = function () {
    Object.assign(options, {
      shown: false
    })
    Object.assign(that.zpmToast, {
      shown: false
    })
    replaceSubTemplate(options)
    if (that.zpmToast.timeout) {
      clearTimeout(that.zpmToast.timeout)
    }
  }
  Vue.prototype.hideToast = hideToast
}
export default ZpmToast
