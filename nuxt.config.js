export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: '生态环境GIS数据共享交换服务平台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['bootstrap-css-only/css/bootstrap.min.css', 'mdbvue/build/css/mdb.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/mdbvue-notifications'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  // modules: ['@nuxtjs/axios'],
  // axios: {
  //   host: '39.98.134.198',
  //   port: '18091'
  // },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    transpile: ['mdbvue']
  },
  router: {
    // base: process.env.NODE_ENV === 'production' ? '/HeNanWeather' : '/'
  }
}
