// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase'

import App from './App'
import padded from './filters/Padded'
import timeDisplay from './filters/TimeDisplay'
import store from './store'

firebase.initializeApp({
    apiKey: 'AIzaSyBykYa61kZAhjQTmUUYjLIVN7UvUeYfXrc',
    authDomain: 'qube-timer.firebaseapp.com',
    databaseURL: 'https://qube-timer.firebaseio.com',
    projectId: 'qube-timer',
    storageBucket: 'qube-timer.appspot.com',
    messagingSenderId: '155102122747',
    timestampsInSnapshots: true
})

Vue.filter('padded', padded)
Vue.filter('timeDisplay', timeDisplay)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    store
})
