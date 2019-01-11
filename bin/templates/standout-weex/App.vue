<!--
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @Date: 2018-12-12 18:33:24
 * @LastEditors: Leo
 * @LastEditTime: 2019-01-10 11:57:14
 * @version: 0.0.0
 * @Description: 
 -->
<template>
  <div class="{{APP_NAME}}"
       @viewappear="openPage"
       @viewdisappear="leavePage">
    <TopNav :title="title"></TopNav>
    <ErrorPage v-if="pageStatus<0"
               @refresh="refresh"></ErrorPage>
    <MainList v-else-if="pageStatus>0"
              class="main"></MainList>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TopNav from '../../components/TopNav.vue'
import ErrorPage from '../../components/ErrorPage.vue'
import MainList from './components/MainList.vue'

import globalMixin from '../../mixins/index'
import { log } from '../../utils'

export default {
  mixins: [globalMixin],
  components: { TopNav, ErrorPage, MainList },
  data() {
    return {
      pageStatus: 0, // 0 默认初始状态；1 加载完成；-1 出错了
      title: '页面标题'
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters([])
  },
  async created() {
    await this.$store.dispatch('getZpfeData')
    this.pageStatus = 1
    this.init()
  },
  methods: {
    async refresh() {
      this.pageStatus = 1
      await this.init()
    },
    async init() {
      try {
        // TODO 页面初始化
      } catch (e) {
        log.toast(e.message)
        this.pageStatus = -1
      }
    }
  }
}
</script>

<style scoped>
.{{APP_NAME}} {
  flex: 1;
}
</style>

<style>
/* stylelint-disable */
html,
body,
.weex-root {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
/* stylelint-enable */
</style>
