<template>
  <div class="timer">
    <h1>
      {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.milliseconds | padded }}
    </h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      elapsed: {
        milliseconds: 0,
        seconds: 0,
        minutes: 0
      },
      timer: null,
      stopped: false
    }
  },

  mounted () {
    window.addEventListener('keydown', event => {
      if (event.key === ' ' && this.timer) {
        this.stopTimer()
        this.stopped = true
      }
    }, true)

    window.addEventListener('keyup', event => {
      if (event.key === ' ') {
        if (this.stopped) {
          this.stopped = false
        } else {
          this.startTimer()
        }
      }
    }, true)
  },

  methods: {
    startTimer () {
      this.timer = window.setInterval(() => {
        if (++this.elapsed.milliseconds >= 100) {
          if (++this.elapsed.seconds >= 60) {
            this.elapsed.minutes++
            this.elapsed.seconds = 0
          }

          this.elapsed.milliseconds = 0
        }
      }, 10)
    },

    stopTimer () {
      window.clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style scoped>
  .timer h1 {
    margin: 0;
    font-family: 'Anonymous Pro', monospace;
    font-size: 100px;
  }
</style>
