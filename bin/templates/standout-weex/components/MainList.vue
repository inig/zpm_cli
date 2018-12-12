<template>
  <list class="list">
    <loading class="loading"
             v-if="loading.show"
             @loading="onloading"
             :display="loading.display?'show':'hide'">
      <text class="indicator-text">加载更多</text>
      <loading-indicator class="indicator"></loading-indicator>
    </loading>
  </list>
</template>

<script>

import { actions } from '../../../store/constants'
import { mapGetters } from 'vuex'
import { log } from '../../../utils'
import { feApiFetch } from '../../../utils/request'

export default {
  data () {
    return {
      loading: {
        display: false,
        show: false
      },
      list: [],
      page: 1,
      size: 30
    }
  },
  computed: {
    ...mapGetters(['uid'])
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      try {
        this.page = 1
        await this.loadData()
      } catch (error) {
        console.log('​catch -> error', error)
        log.toast(error.message)
        this.$root.error = true
      }
    },
    async onloading (event) {
      try {
        this.loading.display = true
        this.page++
        await this.loadData()
        this.loading.display = false
      } catch (error) {
        console.log('​catch -> error', error)
        log.toast(error.message)
      }
    },
    async loadData () {
      let res = await feApiFetch(`/infomation/relationship/message/get?uid=${this.uid}&page=${this.page}&size=${this.size}`)
      if (res.code === 200) {
        if (this.page === 1) {
          this.list.splice(0, this.list.length, ...res.data)
        } else {
          this.list.push(...res.data)
        }
        this.loading.show = !(res.data.length < this.size)
      }
    }
  }
}
</script>

<style scoped>
.list {
  flex: 1;
}
/* list loading style */
.loading {
  width: 750px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
  padding-top: 40px;
}
.indicator-text {
  text-align: center;
  height: 40px;
  font-size: 28px;
  font-family: PingFangSC-Regular;
  color: rgba(102, 102, 102, 1);
  line-height: 40px;
}
.indicator {
  margin-top: 16px;
  height: 40px;
  width: 40px;
  color: #888;
}
</style>
