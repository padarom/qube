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
        <li data-netlify-identity-button></li>
        <li>Show all times</li>
      </ul>
    </nav>

    <aside class="hint">
      <span>
        Press <kbd>Spacebar</kbd> to start the timer
      </span>
    </aside>

    <Statistics />
  </div>
</template>

<script>
import Particle from '&/BackgroundParticle'
import { AvailableShapes as Shapes } from '&/Particles/Shapes'
import Statistics from '&/Statistics'
import Timer from '&/Timer'
import $ from 'jquery'

export default {
  name: 'App',

  components: {
    Particle, Timer, Statistics
  },

  data () {
    return {
      createdObjects: 0,
      spawnParticles: true,
      objects: []
    }
  },

  mounted () {
    window.onblur = () => { this.spawnParticles = false }
    window.onfocus = () => { this.spawnParticles = true }

    window.setInterval(this.createParticles.bind(this), 300)
  },

  methods: {
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
