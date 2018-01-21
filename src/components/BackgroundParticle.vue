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

const ShapeDefinitions = {
  circle: {
    viewbox: '0 0 13 12',
    d: 'M6.5,0.1C3.4,0.1,0.8,2.8,0.8,6s2.6,5.9,5.7,5.9s5.7-2.7,5.7-5.9S9.7,0.1,6.5,0.1L6.5,0.1z M6.5,8.8 C5,8.8,3.8,7.6,3.8,6S5,3.2,6.5,3.2S9.2,4.4,9.2,6S8,8.8,6.5,8.8L6.5,8.8z'
  },
  point: {
    viewbox: '0 0 12 12',
    d: 'M6,7.5L6,7.5C5.1,7.5,4.5,6.9,4.5,6v0c0-0.9,0.7-1.5,1.5-1.5h0c0.9,0,1.5,0.7,1.5,1.5v0C7.5,6.9,6.9,7.5,6,7.5zM6,7.5L6,7.5C5.1,7.5,4.5,6.9,4.5,6v0c0-0.9,0.7-1.5,1.5-1.5h0c0.9,0,1.5,0.7,1.5,1.5v0C7.5,6.9,6.9,7.5,6,7.5z'
  },
  square: {
    viewbox: '0 0 13 14',
    d: 'M5.9,1.2L0.7,6.5C0.5,6.7,0.5,7,0.7,7.2l5.2,5.4c0.2,0.2,0.5,0.2,0.7,0l5.2-5.4 C12,7,12,6.7,11.8,6.5L6.6,1.2C6.4,0.9,6.1,0.9,5.9,1.2L5.9,1.2z M3.4,6.5L6,3.9c0.2-0.2,0.5-0.2,0.7,0l2.6,2.6 c0.2,0.2,0.2,0.5,0,0.7L6.6,9.9c-0.2,0.2-0.5,0.2-0.7,0L3.4,7.3C3.2,7.1,3.2,6.8,3.4,6.5L3.4,6.5z'
  },
  pentahedron: {
    viewbox: '0 0 561.8 559.4',
    d: 'M383.4,559.4h-204l-2.6-0.2c-51.3-4.4-94-37-108.8-83l-0.2-0.6L6,276.7l-0.2-0.5c-14.5-50,3.1-102.7,43.7-131.4 L212.1,23C252.4-7.9,310.7-7.9,351,23l163.5,122.5l0.4,0.3c39,30.3,56,82.6,42.2,130.3l-0.3,1.1l-61.5,198 C480.4,525.6,435.5,559.4,383.4,559.4z M185.5,439.4h195.2l61.1-196.8c0-0.5-0.3-1.6-0.7-2.1L281.5,120.9L120.9,241.2 c0,0.3,0.1,0.7,0.2,1.2l60.8,195.8C182.5,438.5,183.7,439.1,185.5,439.4z M441,240.3L441,240.3L441,240.3z'
  },
  triangle: {
    viewbox: '0 0 561.8 559.4',
    d: 'M383.4,559.4h-204l-2.6-0.2c-51.3-4.4-94-37-108.8-83l-0.2-0.6L6,276.7l-0.2-0.5c-14.5-50,3.1-102.7,43.7-131.4 L212.1,23C252.4-7.9,310.7-7.9,351,23l163.5,122.5l0.4,0.3c39,30.3,56,82.6,42.2,130.3l-0.3,1.1l-61.5,198 C480.4,525.6,435.5,559.4,383.4,559.4z M185.5,439.4h195.2l61.1-196.8c0-0.5-0.3-1.6-0.7-2.1L281.5,120.9L120.9,241.2 c0,0.3,0.1,0.7,0.2,1.2l60.8,195.8C182.5,438.5,183.7,439.1,185.5,439.4z M441,240.3L441,240.3L441,240.3z'
  }
}

export const Shapes = Object.keys(ShapeDefinitions)

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

      let height = $(this.$refs.svg).height()

      if (this.y < -height) {
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
