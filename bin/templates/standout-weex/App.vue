<template>
  <div class="wrapper"
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
import TopNav from '../../components/TopNav.vue'
import ErrorPage from '../../components/ErrorPage.vue'
import MainList from './components/MainList.vue'

import { actions } from '../../store/constants'
import { mapState, mapGetters } from 'vuex'
import { stayTime } from '../../mixin/index'
import { log } from '../../utils'
import { feApiFetch } from '../../utils/request'

export default {
  mixins: [stayTime],
  components: { TopNav, ErrorPage, MainList },
  data () {
    return {
      pageStatus: 0,
      title: ''
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters(['uid'])
  },
  async created () {
    await this.$store.dispatch(actions.sys.GET_ZPFE_DATA)
    this.pageStatus = 1
    this.init()
  },
  methods: {
    async refresh () {
      this.pageStatus = 1
      await this.init()
    },
    async init () {
      try {
        // await Promise.all([this.getUserInfo(), this.getUserSetting()])
      } catch (e) {
        log.toast(e.message)
        this.pageStatus = -1
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  flex: 1;
}
</style>

<style>
html,
body,
.weex-root {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
