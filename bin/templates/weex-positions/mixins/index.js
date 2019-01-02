const navigator = weex.requireModule('navigator')
const getBaseURL = require('../utils/base-url.js').getBaseURL
export default {
  methods: {
    jump (to) {
      if (this.$router) {
        this.$router.push(to)
      }
    },
    back () {
      if (this.$store.state.platform.toLowerCase() === 'web') {
        this.$router.back()
      } else {
        navigator.pop({
          animated: 'true'
        }, event => {
        })
      }
    },
    navigateTo (to) {
      if (this.$store.state.platform.toLowerCase() === 'web') {
        this.jump(to.replace(/.*\/([a-zA-Z0-9_-]*)\.js$/, '$1').toLowerCase())
      } else {
        let baseUrl = getBaseURL(this)
        console.log('BASEURL: ', baseUrl)
        navigator.push({
          url: baseUrl + to,
          animated: 'true'
        }, event => {
        })
      }
    }
  }
}
