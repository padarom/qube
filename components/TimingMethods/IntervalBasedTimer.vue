<script lang="ts">
import TimingMethod from './TimingMethod.vue'
import { State } from '~/types/TimingState'

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
      this.updateState({ state: State.RUNNING })

      this.interval = window.setInterval(() => {
        this.setTime(this.value.time.milliseconds + 10)
      }, 10)
    },

    stopTimer () {
      if (!this.interval) return

      this.updateState({ state: State.FINISHED })

      window.clearInterval(this.interval)
      this.interval = null
    },
  },
})
</script>
