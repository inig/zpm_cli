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
 * Created by liangshan on 2018/7/6.
 */
const storage = weex.requireModule('storage')

const StorageUtil = (function () {
  const _getItem = function (name) {
    return new Promise((resolve, reject) => {
      storage.getItem(name, event => {
        if (event.result === 'success') {
          let _d = event.data
          try {
            _d = JSON.parse(event.data)
          } catch (err) {
            _d = event.data
          }
          resolve({
            result: 'success',
            data: _d
          })
        } else {
          resolve(event)
        }
      })
    })
  }

  const _setItem = function (name, value) {
    return new Promise((resolve, reject) => {
      let _value = value
      if (typeof _value !== 'string') {
        _value = JSON.stringify(_value)
      }
      storage.setItem(name, _value, event => {
        if (event.result === 'success') {
          resolve(event)
        } else {
          resolve(event)
        }
      })
    })
  }

  const _removeItem = function (name) {
    return new Promise((resolve, reject) => {
      if (name) {
        storage.removeItem(name, event => {
          if (event.result === 'success') {
            resolve(event)
          } else {
            resolve(event)
          }
        })
      } else {
        resolve({
          result: 'fail',
          data: 'undefined'
        })
      }
    })
  }

  const _getAllKeys = function () {
    return new Promise((resolve, reject) => {
      storage.getAllKeys(event => {
        if (event.result === 'success') {
          resolve(event)
        } else {
          resolve(event)
        }
      })
    })
  }
  return {
    getItem: _getItem,
    setItem: _setItem,
    removeItem: _removeItem,
    getAllKeys: _getAllKeys
  }
})()

export default StorageUtil
