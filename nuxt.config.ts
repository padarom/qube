import NuxtConfiguration from '@nuxt/config'

const config: NuxtConfiguration = {
  mode: 'spa',

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
    '~plugins/filters'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources'
  ],

  styleResources: {
    stylus: [
        'assets/styl/variables.styl'
    ]
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend() {
    }
  }
}

export default config
