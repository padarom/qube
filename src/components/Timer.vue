<template>
  <div>
    <div class="timer">
      <h2>
        {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.milliseconds | padded }}
      </h2>
    </div>
    <aside class="hint" @click="toggleTimer">
      Press <kbd>Spacebar</kbd> to start.
    </aside>

    <aside>
      <recorded-time :time="1" uuid="abc-def"></recorded-time>
      <recorded-time :time="100" uuid="abc-def"></recorded-time>
      <recorded-time :time="10090" uuid="abc-def"></recorded-time>
      <recorded-time :time="15020" uuid="abc-def"></recorded-time>
      <recorded-time :time="70030" uuid="abc-def"></recorded-time>
    </aside>

  </div>
</template>

<script>
import RecordedTime from './RecordedTime'

export default {
  name: 'HelloWorld',

  components: {
    'recorded-time': RecordedTime
  },

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
    window.addEventListener('keydown', event => {
      if (event.key === ' ') {
        this.toggleTimer()
      }
    }, true)
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

<style scoped>
  .timer h2 {
    font-family: 'Anonymous Pro', monospace;
    font-size: 100px;
  }
</style>
