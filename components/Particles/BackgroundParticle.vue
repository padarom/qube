<template>
    <svg ref="svg"
        :viewBox="shapeDefinition.viewbox"
        v-bind:style="{ transform }"
    >
        <path :class="shape" :d="shapeDefinition.d" />
    </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import ShapeDefinitions from './Shapes'

function getHeight (element: Element): number {
  return parseFloat(getComputedStyle(element, null).height.replace('px', ''))
}

export default Vue.extend({
  props: {
    initialX: {
      type: Number,
      required: true
    },

    initialY: {
      type: Number,
      required: true
    },

    shape: {
      type: String,
      required: true
    },

    destroy: {
      type: Function,
      required: true,
    },

    delta: {
      type: Number,
      required: false
    }
  },

  data () {
    return {
      // Movement related
      x: this.initialX,
      y: this.initialY,
      speed: 1 + Math.random() * 3.2,
      amplitude: Math.random() * 200,
      frequency: window.innerHeight / 2,

      // Display related
      scale: 0.5 + Math.random(),
      rotation: Math.random() * 360,

      shapeDefinition: ShapeDefinitions[this.shape],
      destroyed: false,
    }
  },

  computed: {
    transform (): string {
      return `translateX(${this.x}px)
        translateY(${this.y}px)
        scale(${this.scale})
        rotate(${this.rotation}deg)`
    },
  },

  mounted () {
    this.update()
  },

  beforeDestroy () {
    this.destroyed = true
  },

  watch: {
    delta () {
      this.update()
    },
  },

  methods: {
    update () {
      if (this.destroyed) {
        return
      }

      const height = getHeight(this.$refs.svg as Element) * this.scale

      if (this.y < -(height * 2)) { // Some extra margin for error
        this.destroy()
      }

      this.y -= this.speed
      this.x = this.initialX + Math.sin(this.y * Math.PI / this.frequency) * this.amplitude
      this.rotation = this.y + height
    },
  },
})
</script>

<style lang="stylus" scoped>
  svg
    display: block
    width: 30px
    height: 30px

    position: absolute
    opacity: 0.6
    z-index: -4

  .square
    fill: #2DA94F

  .pentahedron
    fill: #3E82F7

  .point
    fill: #8491A3

  .circle
    fill: #ED412D

  .triangle
    fill: #FDBD00
</style>
