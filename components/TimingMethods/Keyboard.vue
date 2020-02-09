<template>
  <div>
    Press <kbd>Spacebar</kbd> to start and stop the timer
  </div>
</template>

<script lang="ts">
import IntervalBasedTimer from './IntervalBasedTimer.vue'
import { State } from '~/types/TimingState'

export default IntervalBasedTimer.extend({
  data () {
    return {
      spaceReleased: true,
    }
  },

  created () {
    window.addEventListener('keydown', this.keydown, true)
    window.addEventListener('keyup', this.keyup, true)
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.keydown, true)
    window.removeEventListener('keyup', this.keyup, true)
  },

  methods: {
    /**
     * Triggered on a keydown event. Pushing down on the space key resets any previous timers
     * and stops the currently active run.
     *
     * @param event
     */
    keydown (event: KeyboardEvent) {
      if (event.key !== ' ') return

      // Workaround for the keydown event triggering multiple times
      if (!this.spaceReleased) return
      this.spaceReleased = false

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
    keyup (event: KeyboardEvent) {
      if (event.key !== ' ') return
      this.spaceReleased = true

      if (this.value.state === State.RUNNING || this.value.state !== State.READY) return
      this.startTimer()
    },
  },
})
</script>
