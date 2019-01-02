<template lang="html">
  <div class="main-container">
    <home></home>

    <!-- <div class="btn_refresh" @click="refresh">
        <text class="btn_refresh_text">刷新页面</text>
    </div> -->
  </div>
</template>

<script>
import Home from './components/Home.vue'
const env = weex.config.env
const ZPFE = weex.requireModule('ZPFEAPI')
export default {
  name: 'index',
  components: {
    Home
  },
  data: function () {
    return {
      template: 'Vuex',
      env: env
    }
  },
  computed: {
  },
  methods: {
    //   refresh () {
    //     ZPFE.zpmFn({
    //       name: 'refreshWeex'
    //     })
    //   }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
}
html,
body {
  height: 100%;
}
.main-container {
  background-color: #f8f8fa;
  /*display: flex;
        align-items: center;
        justify-content: center;*/
}
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.greeting {
  display: inline-block !important;
  font-size: 30px !important;
  line-height: 50px;
  color: #666;
}
.Emphasize {
  font-size: 30px !important;
  line-height: 50px;
  display: inline-block !important;
  color: rgb(37, 181, 253);
}
.version {
  color: #ccc;
}
/* .btn_refresh {
        position: fixed;
        bottom: 100px;
        right: 100px;
        padding-left: 20px;
        padding-right: 20px;
        height: 50;
        border-radius: 10px;
        background-color: darkcyan;
        align-items: center;
        justify-content: center;
    }
    .btn_refresh_text {
        color: #FFFFFF;
    } */
</style>
