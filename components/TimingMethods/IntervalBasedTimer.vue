<script lang="ts">
import TimingMethod from './TimingMethod.vue'

export default TimingMethod.extend({
  data () {
    return {
      interval: null as number | null,
    }
  },

  beforeDestroy () {
    this.stopTimer()
  },

  methods: {
    startTimer () {
      this.interval = window.setInterval(() => {
        this.setTime(this.value.milliseconds + 10)
      }, 10)
    },

    stopTimer () {
      if (!this.interval) return

      window.clearInterval(this.interval)
      this.interval = null
    },
  },
})
</script>
