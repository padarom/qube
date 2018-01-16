<template>
  <div class="hello">
    <div class="timer">
      <h2>
        {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.milliseconds | padded }}</h2>
    </div>
    <aside class="hint" @click="toggleTimer">
      Press <kbd>Spacebar</kbd> to start.
    </aside>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',

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

  methods: {
    toggleTimer () {
      if (this.timer) {
        window.clearInterval(this.timer)
        this.timer = null
        return
      }

      this.timer = window.setInterval(() => {
        if (++this.elapsed.milliseconds >= 100) {
          if (++this.elapsed.seconds >= 60) {
            this.elapsed.minutes++
            this.elapsed.seconds = 0
          }

          this.elapsed.milliseconds = 0
        }
      }, 10)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .timer h2 {
    font-family: 'Anonymous Pro', monospace;
    font-size: 100px;
  }
</style>
