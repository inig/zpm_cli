<!--
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @Date: 2019-01-09 11:01:24
 * @LastEditors: Leo
 * @LastEditTime: 2019-01-10 11:57:06
 * @version: 0.0.0
 * @Description:
 -->
<template>
  <list class="main-list">
    <cell v-for="item in list"
          :key="item.msgId">
      <div class="main-list__cell">
        <text class="main-list__content">{{ item.companyName }} {{ item.jobTitle }}</text>
        <text class="main-list__time">{{ item.relationShipDisplay }} {{ item.name }}</text>
      </div>
    </cell>
    <loading v-if="loading.show"
             :display="loading.display?'show':'hide'"
             class="main-list__loading"
             @loading="onloading">
      <text class="main-list__indicator-text">加载更多</text>
      <loading-indicator class="main-list__indicator"></loading-indicator>
    </loading>
  </list>
</template>

<script>
import * as env from 'env' // eslint-disable-line
import { mapGetters } from 'vuex'
import { log } from '../../../utils'
import ZPFetch from '../../../utils/fetch'

const request = new ZPFetch() // eslint-disable-line

export default {
  data() {
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
  computed: {},
  created() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.page = 1
        await this.loadData()
      } catch (error) {
        log.toast(error.message)
        this.$root.pageStatus = -1
      }
    },
    async onloading(event) {
      try {
        this.loading.display = true
        this.page++ // eslint-disable-line
        await this.loadData()
        this.loading.display = false
      } catch (error) {
        log.toast(error.message)
      }
    },
    async loadData() {
      const { data: res } = await request.get(
        `/c/sn/api/pass?type=information&path=${encodeURIComponent(
          `/information/expand-connection/list?type=1&pageIndex=${this.page}&pageSize=${this.size}`
        )}`
      )
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
/** @define main-list; weak */
.main-list {
  flex: 1;
}

.main-list__cell {
  background-color: #efefef;
  border-color: #ccc;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
}

/* list loading style */
.main-list__loading {
  align-items: center;
  display: flex;
  height: 200px;
  justify-content: center;
  padding-bottom: 40px;
  padding-top: 40px;
  width: 750px;
}

.main-list__indicator-text {
  color: rgba(102, 102, 102, 1);
  font-size: 28px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.main-list__indicator {
  color: #888;
  height: 40px;
  margin-top: 16px;
  width: 40px;
}
</style>
