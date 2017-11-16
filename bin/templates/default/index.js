import App from './index.vue'
import {
  log
} from '../../utils/log-service'
import {
  nodeEnv
} from 'configs/api'

// 全局异常捕捉
Vue.config.errorHandler = function (err, vm, info) {
  try {
    log({
      level: 'error',
      message: `vue全局异常`,
      data: {
        message: err.message,
        stack: err.stack,
        weexconfig: weex.config
      }
    }).then((res) => {}).catch((err) => { console.log(err) })
  } catch (error) {}
  if (nodeEnv !== 'production') {
    // 重新抛出异常
    throw new Error(err)
  }
}

module.exports = {
  root: App,
  el: '#root'
}
