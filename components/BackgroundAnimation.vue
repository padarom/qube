<template>
    <div class="background">
        <Particle v-for="object in objects" :key="object.id"
            :shape="object.shape"
            :initialX="object.x"
            :initialY="object.y"
            :destroy="destroyParticle(object)"
            :delta="delta"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Particle from './Particles/BackgroundParticle.vue'
import Shapes from './Particles/Shapes'

const ShapeKeys = Object.keys(Shapes)

type ParticleObject = {
  id: number,
  x: number,
  y: number,
  shape: keyof typeof Shapes
}

export default Vue.extend({
  components: { Particle },

  data () {
    return {
      createdObjects: 0,
      objects: [] as ParticleObject[],
      delta: 0,
      maxParticleNumber: 40,
    }
  },

  mounted () {
    window.setInterval(this.createParticles.bind(this), 600)
    window.setInterval(this.advanceParticles.bind(this), 18)
  },

  methods: {
    createParticles () {
      if (this.objects.length > this.maxParticleNumber) {
        return
      }

      this.objects.push({
        id: this.createdObjects++,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
        shape: ShapeKeys[Math.floor(Math.random() * ShapeKeys.length)] as keyof typeof Shapes
      })
    },

    advanceParticles () {
      this.delta = (this.delta + 1 % 100)
    },

    destroyParticle (particle: ParticleObject) {
      return () => {
        let object = this.objects.find(el => el.id === particle.id)
        if (!object) return

        let index = this.objects.indexOf(object)
        this.objects.splice(index, 1)
      }
    }
  }
})
</script>
