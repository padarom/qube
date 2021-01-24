<template>
  <div>
    Press anywhwere in the middle of the screen to start and stop the timer
  </div>
</template>

<script lang="ts">
import IntervalBasedTimer from './IntervalBasedTimer.vue'
import { State } from '~/types/TimingState'

export default IntervalBasedTimer.extend({
  data () {
    return {
      touching: false,
    }
  },

  created () {
    window.addEventListener('touchstart', this.touchstart, true)
    window.addEventListener('touchend', this.touchend, true)
  },

  beforeDestroy () {
    window.removeEventListener('touchstart', this.touchstart, true)
    window.removeEventListener('touchend', this.touchend, true)
  },

  methods: {
    /**
     * Triggered on a keydown event. Pushing down on the space key resets any previous timers
     * and stops the currently active run.
     *
     * @param event
     */
    touchstart (event: TouchEvent) {
      // Workaround for the keydown event triggering multiple times
      if (this.touching) return
      this.touching = true

      if (this.value.state === State.RUNNING) {
        this.stopTimer()
      } else {
        this.updateState({ state: State.READY })
      }
    },

    /**
     * Triggered on a keyup event. Releasing the space key starts the timer.
     *
     * @param event
     */
    touchend (event: TouchEvent) {
      this.touching = false

      if (this.value.state === State.RUNNING || this.value.state !== State.READY) return
      this.startTimer()
    },
  },
})
</script>
