<template>
  <div class="position_item_container"
       bubble="true"
       :position-id="data.id"
       :position-number="data.number"
       :job-id="data.jobId"
       :position-url="data.positionURL"
       :empl-type="data.emplType"
       :data-index="index"
       @click="goPositionDetail">
    <div class="position_item_line position_item_line_1">
      <div class="job_title">
        <text class="job_title_text">{{data.name ? data.name.replace(/\s+/g, '') : ''}}</text>
      </div>
      <div class="job_icon"
           v-if="data.hasOwnProperty('chatWindow') && (data.chatWindow != 0)">
        <image class="job_icon_image"
               src="https://img09.zhaopin.cn/2012/other/mobile/weex/positions/chat2.png"></image>
      </div>
      <div class="job_salary">
        <text class="job_salary_text">{{data.salary60 | salaryPerMonth}}</text>
      </div>
    </div>
    <div class="position_item_line position_item_line_2">
      <div class="job_address">
        <text class="job_address_text">{{data.cityDistrict || data.workCity}}</text>
        <text class="job_salary_separator"
              v-if="data.cityDistrict || data.workCity">|</text>
        <text class="job_address_text">{{data.workingExp.replace(/^不限$/, '经验不限')}}</text>
        <text class="job_salary_separator"
              v-if="data.workingExp">|</text>
        <!--<text class="job_address_text">{{data.education}}</text>-->
        <text class="job_address_text">{{data.education.slice(0, 22 - data.workingExp.length - (data.cityDistrict ? data.cityDistrict.length : data.workCity.length) - 2)}}</text>
        <text class="job_address_text"
              v-if="data.education.length > (22 - data.workingExp.length - (data.cityDistrict ? data.cityDistrict.length : data.workCity.length) - 2)">...</text>
      </div>
      <div class="job_time">
        <div class="job_jyywl"
             v-if="([pageTypes.appHome].indexOf(pageType) > -1) && data.futureJob">
          <text class="job_jyywl_text">就业有位来</text>
        </div>
        <text class="job_time_text"
              key="hasAppliedPosition"
              v-if="data.hasAppliedPosition && showHasAppliedPosition">已投递</text>
        <text class="job_time_text"
              key="PublishTimeDtTag"
              v-else>{{data.publishTime | getTimeTag}}</text>
      </div>
    </div>
    <div class="position_item_line position_item_line_3"
         v-if="data.welfareLabel && data.welfareLabel.length > 0">
      <div class="job_label">
        <div class="job_label_item"
             v-for="(label, idx) in data.welfareLabel"
             :key="idx + '-welfare'"
             :class="['job_label_item_active_' + (label.state > 0)]"
             :style="[label.state > 0 ? activeWelfareLabelBgColor : defaultWelfareLabelBgColor]">
          <text class="job_label_item_text"
                :class="['job_label_item_text_active_' + (label.state > 0)]"
                :style="[label.state > 0 ? activeWelfareLabelColor : defaultWelfareLabelColor]">{{label.value}}</text>
        </div>
      </div>
    </div>
    <div class="position_item_line position_item_line_4">
      <div class="skill_label"
           key="skillLabel"
           v-if="data.skillLabel && data.skillLabel.length > 0">
        <div class="skill_label_item"
             v-for="(label, idx) in data.skillLabel"
             :key="idx + '-skill'"
             :class="['skill_label_item_active_' + (label.state > 0)]"
             :style="[label.state > 0 ? activeSkillLabelBgColor : defaultSkillLabelBgColor]">
          <text class="skill_label_item_text"
                :class="['skill_label_item_text_active_' + (label.state > 0)]"
                :style="[label.state > 0 ? activeSkillLabelColor : defaultSkillLabelColor]">{{label.value}}</text>
        </div>
      </div>
      <div class="gap12"
           key="skillLabelBlank"
           v-else></div>
    </div>
    <div class="position_item_line position_item_line_5"
         :style="{marginTop: ((data.welfareLabel && data.welfareLabel.length > 0 || (data.skillLabel && data.skillLabel.length > 0)) ? '20px' : '6px')}"
         @appear="positionCardAppear">
      <div class="company_name">
        <text class="company_name_text">{{data.companyName.replace(/\s+/g, '')}}</text>
      </div>
      <div class="company_icon">
        <!-- <div class="company_icon" v-if="data.bestEmployerType != 0"> -->
        <image class="company_icon_image"
               key="icon-best"
               v-if="data.bestEmployerType == 1"
               :src="assets.positions.iconBest"></image>
        <image class="company_icon_image"
               key="icon-yxgz"
               v-if="data.bestEmployerType == 2"
               :src="assets.positions.iconYxgz"></image>
      </div>
      <div class="company_dist"
           v-if="data.distance > 0 && pageType === pageTypes.location">
        <text class="company_dist_text"
              key="m"
              v-if="data.distance < 1000">{{parseInt(data.distance)}}米</text>
        <text class="company_dist_text"
              key="km"
              v-else>{{(data.distance / 1000).toFixed(1)}}公里</text>
      </div>
    </div>
    <div class="position_item_line position_item_line_6"
         v-if="[pageTypes.compsize].indexOf(pageType) > -1">
      <div class="company_size">
        <text class="company_size_text">{{data.companySize}}</text>
        <text class="job_salary_separator"
              v-if="data.companySize">|</text>
        <text class="company_size_text"
              v-if="[].indexOf(pageType) > -1">{{data.property}}</text>
        <text class="job_salary_separator"
              v-if="data.property && ([].indexOf(pageType) > -1)">|</text>
        <text class="company_size_text">{{data.industryName.slice(0, 30 - data.companySize.length - 2)}}</text>
        <text class="company_size_text"
              v-if="data.industryName.length > (30 - data.companySize.length - 2)">...</text>
      </div>
    </div>
    <div class="position_item_line position_item_line_7"
         v-if="data.featureLabel && data.featureLabel.length > 0 && data.featureLabel[0].value">
      <div class="job_recommend">
        <div class="job_recommend_image_wrapper"
             v-if="jobLabel.featureLabel && jobLabel.featureLabel.icon">
          <image class="job_recommend_image"
                 :src="jobLabel.featureLabel.iconUrl || assets.positionRecommend"
                 resize="cover"></image>
        </div>
        <div class="job_recommend_tips"
             :style="[1 > 0 ? activeFeatureLabelBgColor : defaultFeatureLabelBgColor]">
          <text class="job_recommend_tips_text"
                :style="[1 > 0 ? activeFeatureLabelColor : defaultFeatureLabelColor]">{{data.featureLabel[0].value}}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .gap12 {
    height: 12px;
  }
  .position_item_container {
    width: 750px;
    padding-top: 24px;
    padding-bottom: 24px;
    padding-left: 32px;
    padding-right: 28px;
    box-sizing: border-box;
    background-color: #ffffff;
    /*margin-top: 20;*/
  }
  .position_item_line {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .position_item_line_1 {
    position: relative;
    justify-content: flex-start;
  }
  .job_title {
    max-width: 384px;
    height: 56px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .job_title_text {
    max-width: 384px;
    font-size: 32px;
    font-weight: 600;
    color: #282828;
    overflow: hidden;
    text-overflow: ellipsis;
    lines: 1;
  }
  .job_icon {
    margin-left: 9px;
    /* margin-bottom: 2; */
    width: 88px;
    height: 38px;
  }
  .job_icon_image {
    width: 88px;
    height: 38px;
  }
  .job_salary {
    position: absolute;
    right: 0;
    top: 0;
    max-width: 250px;
    height: 56px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .job_salary_text {
    font-size: 28px;
    margin-right: 4px;
    font-weight: 600;
    text-align: right;
    color: #ff5c56;
  }
  .job_address {
    max-width: 550px;
    height: 44px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .job_address_text {
    font-size: 24px;
    color: #666666;
    font-weight: 100;
  }
  .job_salary_separator {
    font-size: 24px;
    color: #e6e6e6;
    margin-left: 12px;
    margin-right: 12px;
    padding-bottom: 3px;
  }
  .job_time {
    /*max-width: 260px;*/
    height: 48px;
    margin-right: 4px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .job_time_text {
    font-size: 20px;
    color: #cccccc;
    font-weight: 100;
  }
  .job_jyywl {
    height: 28px;
    /*padding-bottom: 4;*/
    padding-left: 8px;
    padding-right: 8px;
    box-sizing: content-box;
    margin-right: 12px;
    border-color: #2cc9ff;
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .job_jyywl_text {
    color: #2cc9ff;
    font-size: 18px;
  }
  .job_label {
    width: 660px;
    height: 56px;
    /*height: 68;*/
    overflow: hidden;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .job_label_item {
    padding-left: 16px;
    padding-right: 16px;
    margin-right: 8px;
    margin-top: 12px;
    height: 44px;
    box-sizing: border-box;
    background-color: #f8f8fa;
    border-radius: 2px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .job_label_item_text {
    font-size: 24px;
    color: #666666;
    /*font-weight: 100;*/
  }
  .job_label_item_active_true {
    background-color: #edf6ff;
  }
  .job_label_item_text_active_true {
    color: #1a8afa;
  }

  .skill_label {
    width: 660px;
    height: 67px;
    overflow: hidden;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .skill_label_item {
    padding-left: 16px;
    padding-right: 16px;
    margin-right: 8px;
    margin-top: 12px;
    height: 44px;
    /*background-color: transparent;*/
    box-sizing: border-box;
    /*border-width: 1;*/
    /*border-style: solid;*/
    /*border-color: #E6E6E6;*/
    border-radius: 2px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .skill_label_item_text {
    font-size: 24px;
    /*color: #888888;*/
  }
  .skill_label_item_active_true {
    border-color: transparent;
    background-color: #edf6ff;
  }
  .skill_label_item_text_active_true {
    color: #1a8afa;
  }
  .position_item_line_5 {
    position: relative;
    justify-content: flex-start;
  }
  .company_name {
    max-width: 520px;
    height: 48px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .company_name_text {
    max-width: 520px;
    font-size: 24px;
    color: #282828;
    overflow: hidden;
    text-overflow: ellipsis;
    lines: 1;
  }
  .company_icon {
    margin-left: 12px;
    width: 88;
    height: 26px;
  }
  .company_icon_image {
    width: 88px;
    height: 26px;
  }
  .company_dist {
    max-width: 80px;
    height: 48px;
    margin-right: 4px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .company_dist_text {
    font-size: 20px;
    color: #cccccc;
    font-weight: 100;
  }
  .company_size {
    max-width: 660px;
    height: 48px;
    flex-direction: row;
    /*flex-wrap: wrap;*/
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    /*text-overflow: ellipsis;*/
    /*lines: 1;*/
  }
  .company_size_text {
    font-size: 24px;
    color: #666666;
    font-weight: 100;
  }
  .job_recommend {
    max-width: 660px;
    height: 68px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .job_recommend_image_wrapper {
    width: 44px;
    height: 44px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    overflow: hidden;
  }
  .job_recommend_image {
    width: 44px;
    height: 44px;
  }
  .job_recommend_tips {
    padding-left: 16px;
    padding-right: 16px;
    height: 44px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    overflow: hidden;
    background-color: #edf6ff;
  }
  .job_recommend_tips_text {
    font-size: 24px;
    color: #1a8afa;
    max-width: 600px;
    text-overflow: ellipsis;
    white-space: nowrap;
    lines: 1;
  }
</style>

<script>
  import { AppDataUtil, ZpmUtil } from '../utils/index'
  // const ZPFE = weex.requireModule('ZPFEAPI')
  // const modal = weex.requireModule('modal')
  export default {
    name: 'Position',
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      index: {
        type: Number
      },
      uuid: {
        type: String
      },
      pageType: {
        type: String
      },
      jobLabel: {
        type: Object,
        default () {
          return {}
        }
      },
      funczone: {
        type: String,
        default: ''
      },
      taskId: {
        type: [String, Number]
      },
      pushParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        loaded: false,
        pageTypes: {
          location: 'location', // 附近职位
          salary: 'salary', // 高薪职位
          compsize: 'compsize', // 公司规模
          feedback: 'feedback', // 反馈高
          appHome: 'appHome', // weex首页
          showHasAppliedPosition: true // 是否显示“已投递状态”, Android 7.9.24 以下不显示
        },
        assets: {
          positions: {
            iconBest: 'https://img09.zhaopin.cn/2012/other/mobile/weex/positions/best.png',
            iconYxgz: 'https://img09.zhaopin.cn/2012/other/mobile/weex/positions/yxgz.png'
          },
          positionRecommend: 'http://img09.zhaopin.com/2012/other/mobile/weex/pcard/icon_recommend.png'
        }
      }
    },
    computed: {
      defaultFeatureLabelBgColor () {
        let bgColor = '#EDF6FF'
        let bColor = 'transparent'
        let defaultColor = {}
        if (this.jobLabel.hasOwnProperty('featureLabel') && this.jobLabel.featureLabel.hasOwnProperty('defaultColor')) {
          defaultColor = this.jobLabel.featureLabel.defaultColor
        }
        if (defaultColor.hasOwnProperty('backgroundColor')) {
          bgColor = (defaultColor.backgroundColor || bgColor)
        }
        if (defaultColor.hasOwnProperty('borderColor')) {
          bColor = (defaultColor.borderColor || bColor)
        }
        return {
          backgroundColor: this.formatColor(bgColor),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: this.formatColor(bColor)
        }
      },
      activeFeatureLabelBgColor () {
        let bgColor = '#EDF6FF'
        let bColor = 'transparent'
        let activeColor = {}
        if (this.jobLabel.hasOwnProperty('featureLabel') && this.jobLabel.featureLabel.hasOwnProperty('highLight')) {
          activeColor = this.jobLabel.featureLabel.highLight
        }
        if (activeColor.hasOwnProperty('backgroundColor')) {
          bgColor = (activeColor.backgroundColor || bgColor)
        }
        if (activeColor.hasOwnProperty('borderColor')) {
          bColor = (activeColor.borderColor || bColor)
        }
        return {
          backgroundColor: this.formatColor(bgColor),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: this.formatColor(bColor)
        }
      },
      defaultFeatureLabelColor () {
        let color = '#1A8AFA'
        if (this.jobLabel.hasOwnProperty('featureLabel') && this.jobLabel.featureLabel.hasOwnProperty('defaultColor') && this.jobLabel.featureLabel.defaultColor.hasOwnProperty('fontColor')) {
          color = (this.jobLabel.featureLabel.defaultColor.fontColor || color)
        }
        return {
          color: this.formatColor(color)
        }
      },
      activeFeatureLabelColor () {
        let color = '#1A8AFA'
        if (this.jobLabel.hasOwnProperty('featureLabel') && this.jobLabel.featureLabel.hasOwnProperty('highLight') && this.jobLabel.featureLabel.highLight.hasOwnProperty('fontColor')) {
          color = (this.jobLabel.featureLabel.highLight.fontColor || color)
        }
        return {
          color: this.formatColor(color)
        }
      },
      defaultSkillLabelBgColor () {
        let bgColor = 'transparent'
        let bColor = '#E6E6E6'
        let defaultColor = {}
        if (this.jobLabel.hasOwnProperty('skillLabel') && this.jobLabel.skillLabel.hasOwnProperty('defaultColor')) {
          defaultColor = this.jobLabel.skillLabel.defaultColor
        }
        if (defaultColor.hasOwnProperty('backgroundColor')) {
          bgColor = (defaultColor.backgroundColor || bgColor)
        }
        if (defaultColor.hasOwnProperty('borderColor')) {
          bColor = (defaultColor.borderColor || bColor)
        }
        return {
          backgroundColor: this.formatColor(bgColor),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: this.formatColor(bColor)
        }
      },
      activeSkillLabelBgColor () {
        let bgColor = '#EDF6FF'
        let bColor = 'transparent'
        let activeColor = {}
        if (this.jobLabel.hasOwnProperty('skillLabel') && this.jobLabel.skillLabel.hasOwnProperty('highLight')) {
          activeColor = this.jobLabel.skillLabel.highLight
        }
        if (activeColor.hasOwnProperty('backgroundColor')) {
          bgColor = (activeColor.backgroundColor || bgColor)
        }
        if (activeColor.hasOwnProperty('borderColor')) {
          bColor = (activeColor.borderColor || bColor)
        }
        return {
          backgroundColor: this.formatColor(bgColor),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: this.formatColor(bColor)
        }
      },
      defaultSkillLabelColor () {
        let color = '#888888'
        if (this.jobLabel.hasOwnProperty('skillLabel') && this.jobLabel.skillLabel.hasOwnProperty('defaultColor') && this.jobLabel.skillLabel.defaultColor.hasOwnProperty('fontColor')) {
          color = (this.jobLabel.skillLabel.defaultColor.fontColor || color)
        }
        return {
          color: this.formatColor(color)
        }
      },
      activeSkillLabelColor () {
        let color = '#1A8AFA'
        if (this.jobLabel.hasOwnProperty('skillLabel') && this.jobLabel.skillLabel.hasOwnProperty('highLight') && this.jobLabel.skillLabel.highLight.hasOwnProperty('fontColor')) {
          color = (this.jobLabel.skillLabel.highLight.fontColor || color)
        }
        return {
          color: this.formatColor(color)
        }
      },
      defaultWelfareLabelBgColor () {
        let bgColor = '#F8F8FA'
        let bColor = 'transparent'
        let defaultColor = {}
        if (this.jobLabel.hasOwnProperty('welfareLabel') && this.jobLabel.welfareLabel.hasOwnProperty('defaultColor')) {
          defaultColor = this.jobLabel.welfareLabel.defaultColor
        }
        if (defaultColor.hasOwnProperty('backgroundColor')) {
          bgColor = (defaultColor.backgroundColor || bgColor)
        }
        if (defaultColor.hasOwnProperty('borderColor')) {
          bColor = (defaultColor.borderColor || bColor)
        }
        return {
          backgroundColor: this.formatColor(bgColor),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: this.formatColor(bColor)
        }
      },
      activeWelfareLabelBgColor () {
        let bgColor = '#EDF6FF'
        let bColor = 'transparent'
        let activeColor = {}
        if (this.jobLabel.hasOwnProperty('welfareLabel') && this.jobLabel.welfareLabel.hasOwnProperty('highLight')) {
          activeColor = this.jobLabel.welfareLabel.highLight
        }
        if (activeColor.hasOwnProperty('backgroundColor')) {
          bgColor = (activeColor.backgroundColor || bgColor)
        }
        if (activeColor.hasOwnProperty('borderColor')) {
          bColor = (activeColor.borderColor || bColor)
        }
        return {
          backgroundColor: this.formatColor(bgColor),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: this.formatColor(bColor)
        }
      },
      defaultWelfareLabelColor () {
        let color = '#666666'
        if (this.jobLabel.hasOwnProperty('welfareLabel') && this.jobLabel.welfareLabel.hasOwnProperty('defaultColor') && this.jobLabel.welfareLabel.defaultColor.hasOwnProperty('fontColor')) {
          color = (this.jobLabel.welfareLabel.defaultColor.fontColor || color)
        }
        return {
          color: this.formatColor(color)
        }
      },
      activeWelfareLabelColor () {
        let color = '#1A8AFA'
        if (this.jobLabel.hasOwnProperty('welfareLabel') && this.jobLabel.welfareLabel.hasOwnProperty('highLight') && this.jobLabel.welfareLabel.highLight.hasOwnProperty('fontColor')) {
          color = (this.jobLabel.welfareLabel.highLight.fontColor || color)
        }
        return {
          color: this.formatColor(color)
        }
      }
    },
    methods: {
      positionCardAppear (e) {
        let _d = JSON.parse(JSON.stringify(e))
        if (_d.hasOwnProperty('target')) {
          delete _d.target
        }
        if (_d.hasOwnProperty('currentTarget')) {
          delete _d.currentTarget
        }
        this.$emit('appear', Object.assign({}, _d, {
          number: this.data.number || this.data.Number,
          score: this.data.score,
          index: Number(this.index)
        }))
      },
      formatColor (color) {
        // return color.replace(/^#([a-z0-9]{2})([a-z0-9]{6})$/i, (item1, item2, item3) => ('#' + item3 + item2))
        return color.replace(/^#([a-z0-9]{2})([a-z0-9]{2})([a-z0-9]{2})([a-z0-9]{2})$/i, (item1, item2, item3, item4, item5) => 'rgba(' + parseInt('0x' + item3) + ',' + parseInt('0x' + item4) + ',' + parseInt('0x' + item5) + ',' + parseFloat(parseInt('0x' + item2) / 255).toFixed(1) + ')')
      },
      goPositionDetail (event) {
        // 跳转至职位详情页
        const that = this
        that.$emit('click', {
          jdno: this.data.number || this.data.Number,
          pos: this.index
        })
        const attrs = event.target.attr
        if (String(attrs.jobId) === '0' && String(attrs.emplType) === '校园') {
          AppDataUtil.weexGoToWeexOrWebViewByUrl({
            url: attrs.positionUrl || ''
          })
          return
        }
        try {
          AppDataUtil.weexJobInfoDetail(Object.assign({
            id: attrs.positionId,
            number: attrs.positionNumber,
            guid: that.uuid,
            order: Number(attrs.dataIndex),
            configSerialId: weex.config.zpfe.query.configSerialId,
            moduleName: weex.config.zpfe.query.moduleName,
            funczone: that.funczone + '01',
            traceid: that.taskId
          }, this.pushParams || {}), function (res) {
            if (res.hasOwnProperty('isDelivery') && String(res.isDelivery) === '1') {
              // 投递成功
              that.data.hasAppliedPosition = true
            }
          })
        } catch (err) { }
      }
    },
    async created () {
      let appEnv = await AppDataUtil.envInfo()
      let appVersion = appEnv.env.appversion
      if ((weex.config.env.platform.toLowerCase() === 'android') && (ZpmUtil.verstionCompare(appVersion, '7.9.24') < 0)) {
        this.showHasAppliedPosition = false
      }
      this.$nextTick(() => {
        this.loaded = true
      })
    },
    filters: {
      salaryPerMonth (text) {
        let _suffix = (['面议'].indexOf(text.trim()) < 0 ? '/月' : '')
        return text + _suffix
      },
      getTimeTag (timeStr) {
        /**
         * 当日 显示 xx:xx
         * 非当日 显示 xx月xx日
         * 已下线 显示 "已下线"
         * @type {Date}
         * @private
         */
        let outStr = ''
        let _now = new Date()
        _now.setHours(0)
        _now.setMinutes(0)
        _now.setSeconds(0)
        let _today = _now.getTime()
        let _timeObj = JSON.parse(timeStr.replace(/^(\d*)-(\d*)-(\d*)[T ](\d*):(\d*):(\d*)/, '["$1","$2","$3","$4","$5","$6"]'))
        let _target = new Date(_timeObj[0], (Number(_timeObj[1]) - 1), _timeObj[2], _timeObj[3], _timeObj[4], _timeObj[5])
        if (_target.getTime() >= _today) {
          outStr = (_target.getHours() < 10 ? ('0' + _target.getHours()) : _target.getHours()) + ':' + (_target.getMinutes() < 10 ? ('0' + _target.getMinutes()) : _target.getMinutes())
        } else {
          outStr = (_target.getMonth() + 1) + '月' + _target.getDate() + '日'
        }
        return outStr
      }
    }
  }
</script>
