import { env } from 'env'

/**
 * 服务端渲染配置文件
 * @type {String}
 */
async function GET (ctx) {
  let title = '智联招聘'
  let html = `<!DOCTYPE html>
<html>
<head>
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no" name="viewport">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<meta content="telephone=no" name="format-detection">
<meta content="email=no" name="format-detection">
<title>${title}</title>
<link rel='shortcut icon' href='//common-bucket.zhaopin.cn/img/favicon/favicon-2011.ico' />
${ctx.template.tokens.head.style}
${ctx.template.tokens.head.link}
${ctx.template.tokens.head.script}
<script>
var zpStatConfig = {
  page: {
    appid: "A27"
  }
}
</script>
<script src="//common-bucket.zhaopin.cn/js/zpfe-stat-sdk/zpfe-stat-sdk-latest${
  env === 'production' ? '' : '.debug'
}.js"></script>
</head>
<body>
${ctx.template.tokens.body.root}

${ctx.template.tokens.body.script}
</body>
</html>
`
  let result = {
    html: html
  }
  return result
}

export default {
  GET
}
