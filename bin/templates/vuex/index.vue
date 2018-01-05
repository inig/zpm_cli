<template lang="html">
  <div class="main-container">
    <div class="header">
        <text class="greeting">Template </text><text class="Emphasize">{{template}}</text>
    </div>
    <text class="version">weex版本号: {{env.weexVersion}}</text>
  </div>
</template>

<script>
const env = weex.config.env
export default {
  data: function () {
    return {
      template: 'Vuex',
      env: env
    }
  },
  computed: {
  },
  methods: {
  },
  components: {
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
    html, body {
        height: 100%;
    }
    .main-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .greeting {
        display: inline-block!important;
        font-size: 30px!important;
        line-height: 50px;
        color: #666;
    }
    .Emphasize {
        font-size: 30px!important;
        line-height: 50px;
        display: inline-block!important;
        color: rgb(37, 181, 253);
    }
    .version {
        color: #ccc;
    }
</style>
