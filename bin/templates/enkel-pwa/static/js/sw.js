workbox.setConfig({
  debug: false,
  modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/'
})

workbox.skipWaiting()
workbox.clientsClaim()

const precacheController = new workbox.precaching.PrecacheController()

self.addEventListener('install', event => {
  event.waitUntil(precacheController.install())
})

const DEFAULT_CONFIG = {
  cdn: 'https://g.alicdn.com/kg/workbox/3.3.0/',
  caches: {
    version: 'v1',
    prefix: 'enkel:',
    html: {
      cacheName: 'html',
      entries: 20,
      maxAgeSeconds: 43200,
      strategies: 'staleWhileRevalidate'
    },
    js: {
      cacheName: 'js',
      entries: 20,
      maxAgeSeconds: 43200,
      strategies: 'staleWhileRevalidate'
    },
    css: {
      cacheName: 'css',
      entries: 30,
      maxAgeSeconds: 43200,
      strategies: 'staleWhileRevalidate'
    },
    img: {
      cacheName: 'img',
      entries: 40,
      maxAgeSeconds: 43200,
      strategies: 'staleWhileRevalidate'
    },
    font: {
      cacheName: 'font',
      entries: 40,
      maxAgeSeconds: 43200,
      strategies: 'staleWhileRevalidate'
    },
    routes: [
      // {
      //   pathname: '/pwa',
      //   path: 'https://xxxx.com/xxx',
      //   path: /RegExp/,
      //   strategies: 'staleWhileRevalidate',
      //   cacheName: 'route-pwa',
      //   entries: 30,
      //   maxAgeSeconds: 43200
      // }
    ]
  }
}

function configHandler (config) {
  if (config.caches.js) {
    workbox.routing.registerRoute(
      /.*\.(js)$/,
      workbox.strategies[config.caches.js.strategies]({
        cacheName:
          config.caches.prefix +
          config.caches.js.cacheName +
          '-' +
          config.caches.version,
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: config.caches.js.entries,
            maxAgeSeconds: config.caches.js.maxAgeSeconds
          })
        ]
      })
    )
  }

  if (config.caches.html) {
    workbox.routing.registerRoute(
      function (event) {
        if (event.url.pathname === '/') {
          return true
        } else if (event.url.pathname.match(/.*\.(html|htm|jsp)$/)) {
          return true
        } else {
          return false
        }
      },
      workbox.strategies[config.caches.html.strategies]({
        cacheName:
          config.caches.prefix +
          config.caches.html.cacheName +
          '-' +
          config.caches.version,
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: config.caches.html.entries,
            maxAgeSeconds: config.caches.html.maxAgeSeconds
          })
        ]
      })
    )
  }

  if (config.caches.css) {
    workbox.routing.registerRoute(
      /.*\.css$/,
      workbox.strategies[config.caches.css.strategies]({
        cacheName:
          config.caches.prefix +
          config.caches.css.cacheName +
          '-' +
          config.caches.version,
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: config.caches.css.entries,
            maxAgeSeconds: config.caches.css.maxAgeSeconds
          })
        ]
      })
    )
  }

  if (config.caches.img) {
    workbox.routing.registerRoute(
      /.*\.(gif|jpg|jpeg|webp|png|ico)$/,
      workbox.strategies[config.caches.img.strategies]({
        cacheName:
          config.caches.prefix +
          config.caches.img.cacheName +
          '-' +
          config.caches.version,
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
          }),
          new workbox.expiration.Plugin({
            maxEntries: config.caches.img.entries,
            maxAgeSeconds: config.caches.img.maxAgeSeconds
          })
        ]
      })
    )
  }

  if (config.caches.font) {
    workbox.routing.registerRoute(
      /.*\.(eot|otf|fon|font|ttf|ttc|woff|woff2)$/,
      workbox.strategies[config.caches.img.strategies]({
        cacheName:
          config.caches.prefix +
          config.caches.font.cacheName +
          '-' +
          config.caches.version,
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
          }),
          new workbox.expiration.Plugin({
            maxEntries: config.caches.font.entries,
            maxAgeSeconds: config.caches.font.maxAgeSeconds
          })
        ]
      })
    )
  }

  if (config.caches.routes.length > 0) {
    config.caches.routes.map(item => {
      workbox.routing.registerRoute(
        function (event) {
          if (item.pathname) {
            return (
              event.url.pathname.replace(/\/$/, '') ===
              item.pathname.replace(/\/$/, '')
            )
          } else if (item.path) {
            return event.url.href.indexOf(item.path) > -1
          } else if (item.match) {
            return event.url.href.match(item.match)
          } else {
            return false
          }
        },
        workbox.strategies[item.strategies]({
          cacheName:
            config.caches.prefix + item.cacheName + '-' + config.caches.version,
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: item.entries,
              maxAgeSeconds: item.maxAgeSeconds
            })
          ]
        })
      )
    })
  }

  self.addEventListener('activate', event => {
    // event.waitUntil(precacheController.cleanup())

    let cacheDeletePromises = caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (
            !name.match(
              new RegExp(
                config.caches.prefix + '.*' + config.caches.version + '$'
              )
            )
          ) {
            return caches.delete(name)
          } else {
            return Promise.resolve()
          }
        })
      )
    })

    event.waitUntil(Promise.all([cacheDeletePromises]))
  })
}

configHandler(Object.assign({}, DEFAULT_CONFIG, ENKEL_SW_CONFIG))
// fetch('/static/resources/config.js')
//   .then(response => {
//     if (response.ok) {
//       return response.json()
//     } else {
//       throw new Error(response.statusText)
//     }
//   })
//   .then(data => {
//     console.log('...response 2: ', data)
//     configHandler(Object.assign({}, DEFAULT_CONFIG, data))
//   })
//   .catch((err) => {
//     console.log('error: ', err.message)
//     configHandler(DEFAULT_CONFIG)
//   })
