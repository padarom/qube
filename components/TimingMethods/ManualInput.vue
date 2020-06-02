<template>
  <div>
    Enter your time in the field above and press <kbd>Enter</kbd> to confirm.

    <portal to="timer">
      <form @submit.prevent="storeInput" autocomplete="off">
        <input id="manual-input" v-model="input" placeholder="00.000" />
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

  created () {
    this.updateState({ state: State.READY })
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
        // TODO: Add error message
        return
      }

      this.setTime(time.time)
      this.changeAccuracy(time.accuracy)

      this.updateState({ state: State.FINISHED })
    },
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
