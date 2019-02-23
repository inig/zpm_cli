<template>
  <div class="wrapper">
    <p>v1 index</p>
    <p>{{uid}}</p>
    <div class="button"
         @click="mobStatic">神策埋点</div>
  </div>
</template>
<script>
// import {mapActions} from 'vuex'; //TODO vuex辅助函数使用方法
import { actions } from '../../../../store/mutation-types'
export default {
  name: 'v1',
  props: {},
  data() {
    return {}
  },
  computed: {
    uid() {
      return this.$store.state.uid
    }
  },
  watch: {},
  created() {
    setTimeout(() => {
      // this.GET_UID('test') //TODO vuex辅助函数使用方法
      this.$store.dispatch(actions.GET_UID, 'test')
    }, 3000)
  },
  mounted() {},
  methods: {
    // ...mapActions(['GET_UID']) //TODO vuex辅助函数使用方法
    mobStatic() {
      this.$mobStatic({
        tag: 'tag_test',
        eventName: 'eventName',
        tagDesc: '埋点描述tagDesc',
        properties: { batch: '20190214_1_1' },
        callback: this.mobStaticCallback
      })
    },
    mobStaticCallback() {
      console.log('埋点回调')
    }
  },
  destroyed() {}
}
</script>
<style lang="less" scoped>
</style>
