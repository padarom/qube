<template>
  <svg ref="svg"
    :viewBox="shapeDefinition.viewbox"
    v-bind:style="{ transform }"
  >
    <path :class="shape" :d="shapeDefinition.d" />
  </svg>
</template>

<script>
import $ from 'jquery'
import ShapeDefinitions from './Shapes'

export default {
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
      default: () => {}
    }
  },

  data () {
    return {
      // Movement related
      x: this.initialX,
      y: this.initialY,
      speed: 1 + Math.random() * 3.2,
      amplitude: Math.random() * 200,
      frequency: $(window).height() / 2,

      // Display related
      scale: 0.5 + Math.random(),
      rotation: Math.random() * 360,

      shapeDefinition: ShapeDefinitions[this.shape],
      destroyed: false
    }
  },

  computed: {
    transform () {
      return `translateX(${this.x}px)
        translateY(${this.y}px)
        scale(${this.scale})
        rotate(${this.rotation}deg)`
    }
  },

  mounted () {
    this.update()
  },

  beforeDestroy () {
    this.destroyed = true
  },

  methods: {
    update () {
      if (this.destroyed) {
        return
      }

      let height = $(this.$refs.svg).height() * this.scale

      if (this.y < -(height * 2)) { // Some extra margin for error
        this.destroy()
      }

      this.y -= this.speed
      this.x = this.initialX + Math.sin(this.y * Math.PI / this.frequency) * this.amplitude
      this.rotation = this.y + height

      requestAnimationFrame(this.update.bind(this))
    }
  }
}
</script>

<style scoped>
  svg {
    display: block;
    width: 30px;
    height: 30px;

    position: absolute;
    opacity: 0.6;
    z-index: -4;
  }

  .square {
    fill: #2DA94F;
  }

  .pentahedron {
    fill: #3E82F7;
  }

  .point {
    fill: #8491A3;
  }

  .circle {
    fill: #ED412D;
  }

  .triangle {
    fill: #FDBD00;
  }
</style>
