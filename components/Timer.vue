<template>
    <div>
        <div class="timer">
            <h1 class="time">
                {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.decimals | padded(this.accuracy) }}
            </h1>

            <div class="adjustments" v-if="finished">
                <button @click="togglePenalty" :class="{ active: currentSolve.penalty }">+2</button>
                <button @click="toggleDnf" :class="{ active: currentSolve.dnf }">DNF</button>
            </div>
        </div>

        <aside class="hint">
            <component
              :is="timingMethodComponent"
              v-model="currentSolve"
              @ended="store"
              @reset="resetTimer"
            />
        </aside>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TimingMethods, { AvailableTimingMethods } from './TimingMethods'
import TimeEmitter from './TimeEmitter'
import shortid from 'shortid'
import { SolvingTime, createSolvingTime } from '~/types/SolvingTime'
import TimingMethod from './TimingMethods/TimingMethod.vue'

type ElapsedTime = {
  centiseconds: number,
  seconds: number,
  minutes: number
}

type TimingObject = {
  decimals: number,
  seconds: number,
  minutes: number
}

export default Vue.extend({
  data () {
    return {
      currentSolve: createSolvingTime('3x3'),
      finished: false,
      accuracy: 2,
    }
  },

  computed: {
    elapsed (): TimingObject {
      const accuracy = Math.pow(10, this.accuracy)
      const milliseconds = Math.round(this.currentSolve.milliseconds / (1000 / accuracy))

      return {
        decimals: milliseconds % accuracy,
        seconds: Math.floor(milliseconds / accuracy) % 60,
        minutes: Math.floor(milliseconds / accuracy / 60)
      }
    },

    selectedMode (): string {
      return this.$accessor.configuration.mode
    },

    selectedTimingMethod (): AvailableTimingMethods {
      return this.$accessor.configuration.timingMethod
    },

    timingMethodComponent (): typeof TimingMethod {
      return TimingMethods[this.selectedTimingMethod]
    }
  },

  methods: {
    createNewTime () {
      const time = createSolvingTime(this.selectedMode)
      time.timingMethod = this.selectedTimingMethod

      this.currentSolve = time
    },

    resetTimer () {
      this.createNewTime()
      this.finished = false
    },

    async store (e: any) {
      this.currentSolve.created = new Date()

      this.$store.dispatch('times/insert', this.currentSolve)
    },

    togglePenalty () {
      const currentSolve = this.currentSolve!
      this.$set(currentSolve as SolvingTime, 'penalty', !currentSolve.penalty)
      if (currentSolve.penalty) {
        this.$set(currentSolve, 'dnf', false)
      }

      this.$store.dispatch('times/patch', this.currentSolve)
    },

    toggleDnf () {
      const currentSolve = this.currentSolve!
      this.$set(currentSolve, 'dnf', !currentSolve.dnf)
      if (currentSolve.dnf) {
        this.$set(currentSolve, 'penalty', false)
      }

      this.$store.dispatch('times/patch', this.currentSolve)
    },
  },
})
</script>

<style lang="stylus">
  .dot
    width: 2px
    display: inline-block
    position: relative
    color: black

    &.val-1
      top: -10px
      color: green
    &.val--2
      opacity: 0
    &:not(.act)
      color: red

  .timer
    position: relative

  .timer h1
    margin: 0
    font-size: 100px

  .adjustments
    position: absolute
    top: 0
    right: -90px
    display: flex
    flex-direction: column
    justify-content: center
    height: 100%

  .adjustments button
    background: none
    border: none
    outline: none
    cursor: pointer

    font-family: 'Anonymous Pro', monospace
    font-weight: bold
    font-size: 30px
    text-align: left
    color: $color-primary

  .adjustments button.active
    color: #de6060
</style>
