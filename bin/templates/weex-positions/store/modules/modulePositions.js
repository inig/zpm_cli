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
 * Created by liangshan on 2018/8/6.
 */
import { AppDataUtil } from '../../utils/index'
const stream = weex.requireModule('stream')
const formatGetParams = function (params) {
  let out = []
  for (let p in params) {
    if (params.hasOwnProperty(p)) {
      out.push(p + '=' + encodeURIComponent(params[p]))
    }
  }
  return out.join('&')
}
const modulePositions = {
  namespaced: true,
  state: {
    requestUrl: 'https://capi.zhaopin.com/capi/position/searchRecommend',
    requestParams: {
      key: '26412474748748',
      s: '1d4f0ci9e2e4d8cz591e13eiu39ok487f'
    }
  },
  getters: {
    platform () {
      let _platform = '5'
      switch (weex.config.env.platform.toLowerCase()) {
        case 'ios':
          _platform = '5'
          break
        case 'android':
          _platform = '4'
          break
        default:
          _platform = '5'
          break
      }
      return _platform
    }
  },
  actions: {
    getData ({ getters, state }, params) {
      return new Promise(async (resolve, reject) => {
        let userInfo = await AppDataUtil.userInfo()
        let appEnv = await AppDataUtil.envInfo()
        let _data = Object.assign({
          // order: '9',
          // S_SOU_JOB_TYPE: '814',
          // S_SOU_SALARY: '06001,08000',
          // S_SOU_WORK_CITY: '530',
          uticket: userInfo.user.Uticket || '',
          at: userInfo.user ? (userInfo.user.at || userInfo.user.AtNew) : '',
          rt: userInfo.user ? (userInfo.user.rt || userInfo.user.RtNew) : '',
          platform: getters.platform,
          d: appEnv.env.deviceID || '',
          channel: appEnv.env.channel || '',
          k: state.requestParams.key || '',
          s: state.requestParams.s || '',
          v: appEnv.env.appversion.replace(/\./g, '') || '1.0',
          version: appEnv.env.appversion,
          isCompus: '0',
          resumeVersion: '1',
          eventScenario: ''
        }, params)
        try {
          stream.fetch({
            url: `${state.requestUrl}?${formatGetParams(_data)}`,
            method: 'GET',
            type: 'json',
            headers: {
              'Content-Type': 'application/json'
            }
          }, async ({ data }) => {
            if (String(data.statusCode) === '200') {
              if (!data.data) {
                reject(new Error('失败'))
              } else {
                resolve(data.data)
              }
            } else {
              reject(new Error(data.statusDescription))
            }
          })
        } catch (err) {
          reject(new Error(err.message))
        }
      })
    }
  }
}

export default modulePositions
