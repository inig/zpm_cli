async function GET (ctx) {
  let title = '智联招聘'
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title> 
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no, email=no">
  <link rel='shortcut icon' href='//common-bucket.zhaopin.cn/img/favicon/favicon-2011.ico' />
  ${ctx.template.tokens.head.style}
  ${ctx.template.tokens.head.link}
  ${ctx.template.tokens.head.script}
  </head>
  <body>
  ${ctx.template.tokens.body.root}
  ${ctx.template.tokens.body.script}
</body>
</html>
`
  return {
    html: html
  }
}

export default {
  GET
}
