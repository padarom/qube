// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Timer from './components/Timer'
import RecordedTime from './components/RecordedTime'

import padded from './filters/Padded'
import timeDisplay from './filters/TimeDisplay'

Vue.filter('padded', padded)
Vue.filter('timeDisplay', timeDisplay)

Vue.config.productionTip = false

Vue.component('Timer', Timer)
Vue.component('RecordedTime', RecordedTime)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
