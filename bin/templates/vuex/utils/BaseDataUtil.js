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
import ZpmUtil from './ZpmUtil'
const BaseDataUtil = (function () {
  /**
   * 通过 code 查找 基础对象
   * @param byKey 查找的key
   * @param byValue 查找的value，可为String, Array
   * @param targetArray
   * @param deep
   * @returns { CODE: OBJECT }
   * @private
   */
  const _getObjectBy = function (byKey, byValue, targetArray, deep) {
    let _deep = deep
    if (_deep < 1 || targetArray.length < 1) {
      return {}
    }
    let _byValue = byValue
    if (typeof byValue === 'string') {
      _byValue = [byValue]
    }
    let outObject = {}
    let tempItem = {}
    _deep -= 1
    for (let i = 0; i < targetArray.length; i++) {
      tempItem = targetArray[i]
      if (_byValue.indexOf(String(tempItem[byKey])) > -1) {
        outObject[String(tempItem[byKey])] = tempItem
      } else {
        if (tempItem.sublist.length > 0 && _deep > 0 && Object.keys(outObject).length < _byValue.length) {
          let _tempOutObject = _getObjectBy(byKey, _byValue, tempItem.sublist, _deep)
          if (!ZpmUtil.isEmptyObj(_tempOutObject)) {
            outObject = Object.assign({}, outObject, _tempOutObject)
          }
        }
      }
    }
    return outObject
  }
  /**
   * 通过 code 查找 基础对象
   * @param byKey 查找的key
   * @param byValue 查找的value，可为String, Array
   * @param targetArray
   * @param deep
   * @returns [ OBJECT ]
   * @private
   */
  const _getArrayBy = function (byKey, byValue, targetArray, deep) {
    let _deep = deep
    if (_deep < 1 || targetArray.length < 1) {
      return []
    }
    let _byValue = byValue
    if (typeof byValue === 'string') {
      _byValue = [byValue]
    }
    let outObject = []
    let tempItem = {}
    _deep -= 1
    for (let i = 0; i < targetArray.length; i++) {
      tempItem = targetArray[i]
      if (_byValue.indexOf(String(tempItem[byKey])) > -1) {
        outObject.push(tempItem)
      } else {
        if (tempItem.sublist.length > 0 && _deep > 0 && outObject.length < _byValue.length) {
          let _tempOutObject = _getArrayBy(byKey, _byValue, tempItem.sublist, _deep)
          if (_tempOutObject.length > 0) {
            outObject = outObject.concat(_tempOutObject)
          }
        }
      }
    }
    return outObject
  }

  const _getSelectCityItems = function (searchValue, arr) {
    let f = true
    let tempArray = []
    let result = []
    let _loop = function (searchValue, arr, parentKey) {
      try {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]['code'].toString() === searchValue.toString()) {
            tempArray.push({
              name: arr[i].name,
              code: arr[i].code,
              sublist: arr[i].sublist,
              pid: parentKey
            })
            if (arr[i].sublist.length > 0) {
              tempArray.push({
                name: arr[i].name,
                code: arr[i].code,
                sublist: arr[i].sublist,
                pid: arr[i].code
              })
            }
            f = false
            break
          } else {
            if (arr[i]['sublist'].length > 0) {
              if (f) {
                tempArray.push({
                  name: arr[i].name,
                  code: arr[i].code,
                  sublist: arr[i].sublist,
                  pid: parentKey
                })
                _loop(searchValue, arr[i]['sublist'], arr[i]['code'])
              }
            }
          }
        }
      } catch (e) {
      }
    }
    let findParent = function (zNodes, node) {
      var ans = []
      zNodes = zNodes.reverse();
      for (var i = 0; i < zNodes.length; i++) {
        if (node.pid === zNodes[i].code) {
          if (zNodes[i].pid === 0) {
            return zNodes[i]
          }
          ans.push(zNodes[i])
          return ans.concat(findParent(zNodes, zNodes[i]));
        }
      }
    }
    _loop(searchValue, arr, 0)
    try {
      result = findParent(tempArray, {pid: tempArray[tempArray.length - 1].code}).reverse()
    } catch (error) {
    }
    return result
  }
  const _formatCityName = function (e) {
    let test = ''
    e.map(function (item) {
      test = test + ' ' + item.name
    })
    console.log(test)
    let outStr = ''
    if (e.length === 3) {
      if (e[1].code === e[2].code) {
        outStr = e[1].name
      } else {
        outStr = e[1].name + '-' + e[2].name
      }
    } else if (e.length === 2) {
      if (e[0].code === e[1].code) {
        outStr = e[0].name
      } else {
        outStr = e[0].name + '-' + e[1].name
      }
    }
    return outStr
  }
  return {
    getObjectBy: _getObjectBy,
    getArrayBy: _getArrayBy,
    getSelectCityItems: _getSelectCityItems,
    formatCityName: _formatCityName
  }
})()

export default BaseDataUtil
