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

    <sweet-modal ref="login" id="auth-container">This is an alert.</sweet-modal>
  </div>
</template>

<script>
import Particle from '&/BackgroundParticle'
import { AvailableShapes as Shapes } from '&/Particles/Shapes'
import { SweetModal } from 'sweet-modal-vue'
import Statistics from '&/Statistics'
import Timer from '&/Timer'
import $ from 'jquery'
import firebase from 'firebase'
import firebaseui from 'firebaseui'
require('firebase/firestore')

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
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: ['email']
          },
          {
            provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
            scopes: ['user:email']
          },
          {
            provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            scopes: ['email']
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
        x: Math.random() * $(window).width(),
        y: $(window).height(),
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

<style>
body, html {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
}

.hint {
  position: absolute;
  width: 100%;

  bottom: 20px;
  text-align: center;

  font-size: 14px;
}

kbd {
  display: inline-block;
  padding: 4px 6px 4px 8px;
  margin: 0 2px;
  border: 1px solid #dedede;
  border-radius: 3px;

  font-family: 'Anonymous Pro', monospace;
  font-weight: 400;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
}

.navigation {
  position: absolute;
  right: 0;
  top: 0;
}

.navigation ul {
  list-style: none;
  padding: 0;
  margin: 16px;
}

.navigation li {
  display: inline-block;
  margin-left: 20px;
}

.navigation .netlify-identity-button {
  color: green !important;
}
</style>
