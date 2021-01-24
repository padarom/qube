import { Configuration } from '@nuxt/types'

const config: Configuration = {
  mode: 'spa',

  server: {
    host: '0.0.0.0',
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'Qube',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    script: [
      { src: 'https://kit.fontawesome.com/20bdd8bf1b.js', type: 'text/javascript', integrity: 'sha384-WAsFbnLEQcpCk8lM1UTWesAf5rGTCvb2Y+8LvyjAAcxK1c3s5c0L+SYOgxvc6PWG', crossorigin: 'anonymous' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Anonymous+Pro:400,700' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~assets/styl/app.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/components',
    '~plugins/auth',
    '~plugins/filters',
    '~plugins/vuexFirestore',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/toast',
    'portal-vue/nuxt',
    [
      '@nuxtjs/google-adsense', {
        id: 'ca-pub-2592802788414327',
      }
    ],
    ['nuxt-fire', {
        config: {
          apiKey: 'AIzaSyBykYa61kZAhjQTmUUYjLIVN7UvUeYfXrc',
          authDomain: 'qube-timer.firebaseapp.com',
          databaseURL: 'https://qube-timer.firebaseio.com',
          projectId: 'qube-timer',
          storageBucket: 'qube-timer.appspot.com',
          messagingSenderId: '155102122747',
          appId: '1:155102122747:web:0a8d7e52bd4c9da402965e',
        },
        services: {
          auth: true,
          firestore: {
            enablePersistence: true,
          },
        }
    }],
  ],

  buildModules: [
    '@nuxt/typescript-build',
    'nuxt-typed-vuex',
  ],

  styleResources: {
    stylus: [
      'assets/styl/variables.styl'
    ]
  },

  /**
   * See https://github.com/nuxt-community/modules/tree/master/packages/toast
   */
  toast: {
    position: 'top-center',
    duration: 3500,
    keepOnHover: true,
    iconPack: 'fontawesome',
    containerClass: 'qube',
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [
      /typed-vuex/,
    ],
    extend() {
    }
  }
}

export default config
