// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import padded from './filters/Padded'
import timeDisplay from './filters/TimeDisplay'

Vue.config.productionTip = false

Vue.filter('padded', padded)
Vue.filter('timeDisplay', timeDisplay)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
