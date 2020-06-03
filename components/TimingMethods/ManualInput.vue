<template>
  <div>
    Enter your time in the field above and press <kbd>Enter</kbd> to confirm.<br>
    Press <kbd>Enter</kbd> again to reset.

    <portal to="timer">
      <form @submit.prevent autocomplete="off">
        <input id="manual-input" v-model="input" placeholder="00.000" ref="timeInput" autofocus />
      </form>
    </portal>
  </div>
</template>

<script lang="ts">
import TimingMethod from './TimingMethod.vue'
import TimingState, { State, createTimingState } from '~/types/TimingState'

export default TimingMethod.extend({
  data () {
    return {
      input: '',
    }
  },

  mounted () {
    this.reset()
    window.addEventListener('keyup', this.keyup, true)
  },

  beforeDestroy () {
    window.removeEventListener('keyup', this.keyup, true)
  },

  computed: {
    parsedTime (): { time: number, accuracy: number } | null {
      const regex = /((?<minutes>\d+):)?(?<seconds>\d+)?\.(?<decimals>\d+)/
      const match = regex.exec(this.input)
      if (!match) return null

      let { minutes, seconds, decimals } = match.groups!

      decimals = decimals.substr(0, 3)
      const accuracy = Math.max(2, decimals.length)

      const time = parseInt(minutes || '0') * 60 * 1000 +
                   parseInt(seconds || '0') * 1000 +
                   parseInt(decimals.padEnd(3, '0'))

      return { time, accuracy }
    },
  },

  methods: {
    storeInput () {
      const time = this.parsedTime
      if (!time) {
        return this.$toast.error(
          '<span>Your entered time has to be in the format <code>00:00.000</code> or <code>00.000</code>.</span>',
          { icon: 'fa-exclamation-triangle' }
        )
      }

      this.setTime(time.time)
      this.changeAccuracy(time.accuracy)

      this.updateState({ state: State.FINISHED })
    },

    reset () {
      this.updateState({ state: State.READY })
      this.input = ''

      // @see https://portal-vue.linusb.org/guide/caveats.html#refs
      this.$nextTick(() => {
        this.$nextTick(() => {
          const input = this.$refs.timeInput as HTMLElement
          input.focus()
        })
      })
    },

    keyup (event: KeyboardEvent) {
      // Only allow resets with space or enter
      if (event.key !== 'Enter') return

      // Only allow resets when we are already finished
      if (this.value.state === State.FINISHED) {
        this.reset()
      } else {
        this.storeInput()
      }
    }
  },
})
</script>

<style scoped lang="stylus">
  #manual-input
    font-size: inherit
    font-family: inherit
    font-weight: inherit
    text-align: center
    border: none
    background: transparent
    padding: 300px 0
    outline: none
</style>
