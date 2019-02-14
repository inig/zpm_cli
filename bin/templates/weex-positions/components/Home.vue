<template>
  <div class="home_container">
    <list offset-accuracy="10"
          class="list_container op0"
          @scroll="mainScroll"
          ref="listRef"
          :style="containerStyles"
          :loadmoreoffset="600"
          @loadmore="loadMorePositions">
      <cell>
        <div class="header_image_container"
             :style="{height: adjustWeb(statusBarHeight + 260) + 'px'}">
          <image src="$$TEMPLATE_HD_BG$$"
                 class="header_bg_image"
                 resize="cover"
                 :style="{height: adjustWeb(statusBarHeight + 260) + 'px'}"></image>
          <image src="$$TEMPLATE_HD_CT$$"
                 class="header_image"
                 resize="cover"></image>
        </div>
      </cell>
      <cell v-for="(position, index) in positions"
            :key="index"
            :keep-scroll-position="true"
            v-if="positions.length > 0">
        <position class="position_item"
                  :data="position"
                  :index="index"
                  :job-label="jobLabel"
                  page-type="appHome"
                  :funczone="funczone"
                  :uuid="UUID"></position>
      </cell>
      <cell v-if="positions.length === 0">
        <div class="position-empty-container"
             :style="emptyContainerStyles">
          <image :src="assets.positionEmpty"
                 resize="cover"
                 class="position-empty-image"></image>
          <div class="position-empty-tip">
            <text class="position-empty-tip-text">暂无推荐职位，搜索试试吧</text>
          </div>
        </div>
      </cell>
    </list>

    <div class="topbar"
         :style="topbarStyles">
      <div class="top_blank"
           :style="{height: adjustWeb(statusBarHeight) + 'px'}"></div>
      <div class="header_main">
        <div class="header_title">
          <text class="header_title_text"
                :style="headerTitleStyles">$$TEMPLATE_TITLE$$</text>
        </div>
        <div class="return_box"
             @click="goBack">
          <image src="//img09.zhaopin.cn/2012/other/mobile/weex/searchJobResult/returnback3X.png"
                 class="return_back_image"></image>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.op0 {
  opacity: 0;
}
.header_image_container {
  position: relative;
  width: 750;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
}
.header_bg_image {
  position: absolute;
  left: 0;
  top: 0;
  width: 750;
}
.header_image {
  width: 750;
  height: 320;
}

.position_item_0 {
  margin-top: 0;
}
.position_item {
  margin-top: 20;
}

.topbar {
  width: 750;
  /*height: 140;*/
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
}
.header_main {
  width: 750;
  height: 65;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
}
.return_box {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 76;
  height: 65;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}
.return_back_image {
  width: 44;
  height: 44;
}
.header_title {
  width: 750;
  height: 65;
  display: flex;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}
.header_title_text {
  font-size: 36;
  color: #282828;
  text-overflow: ellipsis;
  lines: 1;
}

.position-empty-container {
  width: 750px;
  background-color: #ffffff;
}
.position-empty-image {
  width: 750px;
  height: 420px;
  margin-top: 50px;
}
.position-empty-tip {
  padding-top: 20px;
  background-color: #ffffff;
}
.position-empty-tip-text {
  font-size: 32px;
  color: #666666;
  text-align: center;
}
</style>
<script>
import { AppDataUtil, ZpmUtil } from '../utils/index'
import Position from './Position.vue'
import { createNamespacedHelpers } from 'vuex'
import { host } from 'env'
const { mapActions } = createNamespacedHelpers('./store/modules')
const stream = weex.requireModule('stream')
const navigator = weex.requireModule('navigator')
const animation = weex.requireModule('animation')
const dom = weex.requireModule('dom')
const modal = weex.requireModule('modal')
export default {
  name: 'home',
  components: {
    Position
  },
  data () {
    return {
      statusBarHeight: 60,
      bodyHeight: 0,
      assets: {
        positionEmpty: 'https://img09.zhaopin.cn/2012/other/mobile/weex/position-empty2.png'
      },
      offsetY: 0,
      searchRange: 5, // 搜索范围 5公里
      baseParams: {
        k: '26412474748748',
        s: '1d4f0ci9e2e4d8cz591e13eiu39ok487f'
      },
      requestParams: {
        pageIndex: 0,
        pageSize: 30
      },
      positions: [],
      jobLabel: {},
      funczone: '0000',
      UUID: '',
      firstPage: true,
      positionsLoaded: false,
      pageLoaded: false,
      locationInfo: {
        cityId: '',
        lat: '',
        lng: ''
      },
      jobTarget: {}
    }
  },
  computed: {
    store () {
      return global.$$APP_NAME$$.store
    },
    topbarStyles () {
      if (this.offsetY < -100) {
        return {
          backgroundColor: 'rgba(255, 255, 255, 1)'
        }
      } else {
        return {
          backgroundColor: 'rgba(255, 255, 255, ' + (1 - (this.offsetY + 100) / 100).toFixed(2) + ')'
        }
      }
    },
    headerTitleStyles () {
      if (this.offsetY > -20) {
        return {
          opacity: 0
        }
      } else if (this.offsetY < -100) {
        return {
          opacity: 1
        }
      } else {
        return {
          opacity: (1 - (this.offsetY + 100) / 100).toFixed(2)
        }
      }
    },
    containerStyles () {
      let _platform = weex.config.env.platform.toLowerCase()
      if (_platform === 'android') {
        return {
          height: this.adjustWeb(this.bodyHeight + this.statusBarHeight) + 'px'
        }
      } else {
        return {
          height: this.adjustWeb(this.bodyHeight) + 'px'
        }
      }
    },
    emptyContainerStyles () {
      return {
        height: this.adjustWeb(this.bodyHeight - this.statusBarHeight - 260) + 'px'
      }
    }
  },
  async created () {
    const that = this
    this.bodyHeight = this.getScreenHeight()
    await this.getLocationInfo()
    this.UUID = ZpmUtil.getUUID()
    this.statusBarHeight = await AppDataUtil.weexGetStatusBarHeight()
    await this.getJobTarget().catch(err => {
      this.jobTarget = {}
    }).then(jobTarget => {
      this.jobTarget = jobTarget
    })
    this.pageLoaded = true
    await this.getPositions()
  },
  methods: {
    ...mapActions([
      'modulePositions'
    ]),
    goBack () {
      navigator.pop()
    },
    mainScroll (evt) {
      this.offsetY = evt.contentOffset.y
    },
    getLocationInfo () {
      return new Promise(async (resolve) => {
        if (!this.locationInfo.cityId) {
          let locationInfo = await AppDataUtil.locationInfo()
          if (locationInfo.location && locationInfo.location.cityID) {
            // 有定位
            this.locationInfo = {
              cityId: locationInfo.location.cityID,
              lat: locationInfo.location.latitude,
              lng: locationInfo.location.longitude
            }
          } else {
            // 无定位
            this.locationInfo = {
              cityId: '',
              lat: '',
              lng: ''
            }
          }
        }
        resolve(true)
      })
    },
    resetRequestParams () {
      this.requestParams = {
        pageIndex: 0,
        pageSize: 30
      }
    },
    sleep (ts) {
      return new Promise(resolve => {
        setTimeout(resolve, ts || 300)
      })
    },
    getJobTarget () {
      const that = this
      return new Promise(async (resolve, reject) => {
        let _platform = 'iPhone'
        switch (weex.config.env.platform.toLowerCase()) {
          case 'ios':
            _platform = 'iPhone'
            break
          case 'android':
            _platform = 'Android'
            break
          default:
            _platform = 'iPhone'
            break
        }
        let resumeInfo = await AppDataUtil.resumeInfo()
        let targetResume = {}
        let _resumes = that.$getValueByKey('resumes', resumeInfo.resume)
        if (!_resumes || _resumes.length === 0) {
          reject(new Error('无简历'))
        }
        if (_resumes && _resumes.length > 1) {
          for (let i = 0; i < _resumes.length; i++) {
            if (that.$getValueByKey('defaultType', _resumes[i]) > 0) {
              targetResume = _resumes[i]
              i = _resumes.length
            }
          }
          if (ZpmUtil.isEmptyObj(targetResume)) {
            // 无默认简历
            _resumes.sort(function (item1, item2) {
              return that.$getValueByKey('updateDate', item1) < that.$getValueByKey('updateDate', item2)
            })
            for (let j = 0; j < _resumes.length; j++) {
              if (that.$getValueByKey('postStatus', _resumes[j]) > 0) {
                targetResume = _resumes[j]
                j = _resumes.length
              }
            }
          }
        } else {
          // 用户最多1份简历
          targetResume = _resumes[0]
        }
        let userInfo = await AppDataUtil.userInfo()
        let appEnv = await AppDataUtil.envInfo()
        let _data = {
          uticket: userInfo.user ? userInfo.user.Uticket : '',
          at: userInfo.user ? (userInfo.user.at || userInfo.user.AtNew) : '',
          rt: userInfo.user ? (userInfo.user.rt || userInfo.user.RtNew) : '',
          platform: _platform,
          d: appEnv.env.deviceID || '',
          channel: appEnv.env.channel || '',
          k: this.baseParams.k,
          s: this.baseParams.s,
          v: appEnv.env.appversion.replace(/\./g, '') || '1.0',
          resumeVersion: this.$getValueByKey('version', targetResume),
          resumeLanguage: 1,
          resumeId: this.$getValueByKey('id', targetResume),
          resumeNumber: this.$getValueByKey('number', targetResume)
        }
        try {
          stream.fetch({
            url: `${host}/c/m/app/home/topmenu`,
            method: 'POST',
            type: 'json',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(_data)
          }, ({ data }) => {
            resolve(data.data)
          })
        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },
    dealWithSalary (salary) {
      let _s = ''
      let _l = salary.length
      if (salary) {
        _s = salary.slice(0, _l / 2) + ',' + salary.slice(_l / 2)
      }
      return _s
    },
    getPositions (data) {
      return new Promise(async (resolve, reject) => {
        this.positionsLoaded = false
        let _requestParams = Object.assign({}, this.requestParams)
        if (this.locationInfo && this.locationInfo.cityId) {
          _requestParams = Object.assign(_requestParams, {
            S_SOU_WORK_CITY: this.locationInfo.cityId
          })
        }
        if (data) {
          _requestParams = Object.assign(_requestParams, data)
        }
        await this.store.dispatch('modulePositions/getData', _requestParams).catch(err => {
          reject(new Error(err.message))
        }).then(positionsData => {
          this.firstPage = false
          this.requestParams.pageIndex += 1
          if (this.requestParams.pageIndex === 1) {
            this.positions = positionsData.list || []
          } else {
            this.positions = this.positions.concat(positionsData.list || [])
          }
          this.jobLabel = positionsData.jobLabel || {}
          modal.toast({
            message: '搜索职位'
          })
          this.positionsLoaded = true
          resolve(true)
        })
      })
    },
    async loadMorePositions () {
      if (this.positions.length > 0) {
        await this.getPositions()
      }
    }
  },
  filters: {
    distance (text) {
      let _t = Number(text)
      if (_t / 1000 > 1) {
        return Math.ceil(_t / 1000) + '千米'
      } else {
        return Math.ceil(_t) + '米'
      }
    }
  },
  watch: {
    pageLoaded (val) {
      if (val) {
        let listRef = this.$refs.listRef
        listRef && animation.transition(listRef, {
          styles: {
            opacity: 1
          },
          duration: 300,
          delay: 0
        })
      }
    }
  }
}
</script>