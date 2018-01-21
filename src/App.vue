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

    <aside class="hint">
      Press <kbd>Spacebar</kbd> to start.
    </aside>

    <aside class="last-times">
      <RecordedTime :time="1" uuid="abc-def"></RecordedTime>
      <RecordedTime :time="100" uuid="abc-def"></RecordedTime>
      <RecordedTime :time="10090" uuid="abc-def"></RecordedTime>
      <RecordedTime :time="15020" uuid="abc-def"></RecordedTime>
      <RecordedTime :time="70030" uuid="abc-def"></RecordedTime>
    </aside>
  </div>
</template>

<script>
import Particle, { Shapes } from '&/BackgroundParticle'
import RecordedTime from '&/RecordedTime'
import Timer from '&/Timer'
import $ from 'jquery'

export default {
  name: 'App',

  components: {
    Particle, RecordedTime, Timer
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
        y: $(window).height() - 100,
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
