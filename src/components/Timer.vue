<template>
  <div class="timer">
    <h1>
      {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.milliseconds | padded }}
    </h1>
  </div>
</template>

<script>
import KeyboardTimer from './TimingMethods/KeyboardTimer'

export default {
  data () {
    return {
      elapsed: {
        milliseconds: 0,
        seconds: 0,
        minutes: 0
      },
      timer: null
    }
  },

  mounted () {
    let timer = new KeyboardTimer()
    timer.onStart = this.startTimer
    timer.onStop = this.stopTimer
    timer.onReset = this.resetTimer
  },

  methods: {
    resetTimer () {
      this.elapsed.milliseconds = 0
      this.elapsed.seconds = 0
      this.elapsed.minutes = 0
    },

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
