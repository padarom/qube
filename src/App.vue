<template>
  <div id="app">
    <div class="background">
      <Particle v-for="object in objects" :key="object.id"
        :shape="object.shape"
        :initialX="object.x"
        :initialY="object.y"
        :destroy="destroyParticle(object)"
      />
    </div>

    <Timer></Timer>

    <nav class="navigation">
      <ul>
        <li v-if="user">{{ user.displayName ? user.displayName : user.email }}</li>
        <li v-else @click="$refs.login.open()">Login</li>
        <li>Show all times</li>
      </ul>
    </nav>

    <aside class="hint">
      <span>
        Press <kbd>Spacebar</kbd> to start the timer
      </span>
    </aside>

    <Statistics />

    <sweet-modal ref="login" width="300px">
      <div id="auth-container"></div>
    </sweet-modal>
  </div>
</template>

<script>
import Particle from '&/Particles/BackgroundParticle'
import { AvailableShapes as Shapes } from '&/Particles/Shapes'
import { SweetModal } from 'sweet-modal-vue'
import Statistics from '&/Statistics'
import Timer from '&/Timer'
import firebase from 'firebase'
import firebaseui from 'firebaseui'
require('@firebase/firestore')

export default {
  name: 'App',

  components: {
    Particle, Timer, Statistics, SweetModal
  },

  data () {
    return {
      createdObjects: 0,
      spawnParticles: true,
      objects: [],
      user: null
    }
  },

  mounted () {
    /*
      const uid = result.user.uid
      const db = firebase.firestore()

      db.collection(uid).add({
        date: Date.now(),
        speed: 146
      })
    */

    window.onblur = () => { this.spawnParticles = false }
    window.onfocus = () => { this.spawnParticles = true }

    window.setInterval(this.createParticles.bind(this), 300)

    firebase.auth().onAuthStateChanged((user) => { this.user = user })
    this.setupFirebaseUI()
  },

  methods: {
    setupFirebaseUI () {
      const ui = new firebaseui.auth.AuthUI(firebase.auth())

      ui.start('#auth-container', {
        signInOptions: [
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: ['email']
          },
          {
            provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            scopes: ['email']
          },
          {
            provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
            scopes: ['user:email']
          },
          {
            provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID
          }
        ]
      })
    },

    createParticles () {
      if (!this.spawnParticles) {
        return
      }

      this.objects.push({
        id: this.createdObjects++,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
        shape: Shapes[Math.floor(Math.random() * Shapes.length)]
      })
    },

    destroyParticle (particle) {
      return () => {
        let object = this.objects.find(el => el.id === particle.id)
        let index = this.objects.indexOf(object)
        this.objects.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss">
  @import './scss/app';
</style>
