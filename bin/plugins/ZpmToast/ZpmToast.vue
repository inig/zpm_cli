<template>
    <div class="zpm-toast-container" :style="{height: (deviceInfo.deviceHeight * 750 / deviceInfo.deviceWidth) + 'px'}">
        <text class="zpm-toast-content" :ref="ref" :class="['zpm-toast-content-' + options.type, 'zpm-toast-content-' + options.position, options.shown ? 'shown' : 'hidden']" :style="{color: options.color || '#FFFFFF'}">{{options.content || '提示'}}</text>
    </div>
</template>
<style scoped>
    @-webkit-keyframes toastFadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes toastFadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @-webkit-keyframes toastFadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    @keyframes toastFadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    .zpm-toast-container {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999999;
        width: 750px;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .zpm-toast-content {
        line-height: 34px;
        font-size: 26px;
        font-weight: 300;
        padding: 20px;
        box-sizing: border-box;
        width: 750px;
        opacity: 0;
        -webkit-transition: all 0.3s ease-in-out;
        -moz-transition: all 0.3s ease-in-out;
        -ms-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
    }
    .zpm-toast-content.shown {
        opacity: 1;
    }
    .zpm-toast-content.hidden {
        opacity: 0;
    }
    .zpm-toast-content-top {
        position: fixed;
        top: 0;
    }
    .zpm-toast-content-center {
        width: 500px;
        border-radius: 5px;
    }
    .zpm-toast-content-bottom {
        position: fixed;
        bottom: 0;
        margin-bottom: 0;
    }
    .zpm-toast-container-true {
        animation: toastFadeIn .2s linear;
        animation-delay: .1s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }
    .zpm-toast-container-false {
        animation: toastFadeOut .2s linear;
        animation-delay: .1s;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
    }
    .zpm-toast-content-black {
         background-color: rgb(0, 0, 0);
     }
    .zpm-toast-content-success {
         background-color: rgb(92, 184, 92);
     }
    .zpm-toast-content-info {
         background-color: rgb(91, 192, 222);
     }
    .zpm-toast-content-warning {
         background-color: rgb(240, 173, 78);
     }
    .zpm-toast-content-error {
         background-color: rgb(217, 83, 79);
     }
</style>
<script>
  const modal = weex.requireModule('modal')
  const animation = weex.requireModule('animation')
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  function getUUID () {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
  }
  export default {
    props: ['data-bg-color', 'data-color'],
    name: 'ZpmToast',
    data() {
      return {
        ref: 'test',
        options: {
          type: 'info',
          position: 'bottom',
          content: '这个章节假设你已经对 Vue 组件有一定的了解。当然你也可以先跳过这里，稍后再回过头来看。这个章节假设你已经对 Vue 组件有一定的了解。当然你也可以先跳过这里，稍后再回过头来看。',
          duration: 3000,
          bgColor: '',
          color: '',
          shown: false,
          timeout: null
        },
        deviceInfo: weex.config.env
      };
    },
    computed: {
      toastId () {
        return getUUID()
      }
    },
    methods: {
      getUUID () {
        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
      }
    },
    components: {},
    mounted () {
      const that = this
      setTimeout(function () {
        that.options.shown = true;
//        modal.alert({
//          message: that.$refs
//        })
      }, 3000)

//      modal.alert({
//        message: this.deviceInfo.deviceHeight
//      })
    },
    watch: {
      'options.shown': function (value) {
//        modal.alert({
//          message: JSON.stringify(this.$refs[this.ref])
//        })
        let toastEl = this.$refs[this.ref]
        if (value) {
          modal.toast({
            message: '显示'
          })

        } else {

        }
      }
    }
  };
</script>
