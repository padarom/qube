<template>
    <div>
        <div class="timer">
            <h1 class="time" v-if="finished">
                {{ currentSolve.time | timeDisplay }}
            </h1>

            <h1 class="time" v-else>
                <portal-target name="timer">
                    {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.decimals | padded(this.decimals) }}
                </portal-target>
            </h1>

            <div class="adjustments" v-if="finished && competitionMode">
                <button @click="togglePenalty" :class="{ active: currentSolve.time.penalty }">+2</button>
                <button @click="toggleDnf" :class="{ active: currentSolve.time.dnf }">DNF</button>
            </div>
        </div>

        <aside class="hint">
            <div v-if="scramblesEnabled" class="scramble">
              <p>{{ nextScramble }}</p>
            </div>

            <component
              :is="timingMethodComponent"
              v-model="currentSolve"
              @state-changed="stateChanged"
            />
        </aside>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TimingMethods, { AvailableTimingMethods } from './TimingMethods'
import TimingState, { State, createTimingState } from '~/types/TimingState'
import TimingMethod from './TimingMethods/TimingMethod.vue'
import firebase from 'firebase'
import Scrambo from 'scrambo'

type TimingObject = {
  decimals: number,
  seconds: number,
  minutes: number
}

const scrambler = new Scrambo()

export default Vue.extend({
  data () {
    return {
      currentSolve: createTimingState('3x3'),
      nextScramble: scrambler.get()[0],
    }
  },

  computed: {
    elapsed (): TimingObject {
      const accuracy = Math.pow(10, this.decimals)
      const milliseconds = Math.round(this.currentSolve.time.milliseconds / (1000 / accuracy))

      return {
        decimals: milliseconds % accuracy,
        seconds: Math.floor(milliseconds / accuracy) % 60,
        minutes: Math.floor(milliseconds / accuracy / 60)
      }
    },

    finished (): boolean {
      return this.currentSolve.state === State.FINISHED
    },

    decimals (): number {
      return this.currentSolve.time.decimals || 2
    },

    selectedMode (): string {
      return this.$accessor.configuration.mode
    },

    selectedTimingMethod (): AvailableTimingMethods {
      return this.$accessor.configuration.timingMethod
    },

    timingMethodComponent (): typeof TimingMethod {
      return TimingMethods[this.selectedTimingMethod]
    },

    competitionMode (): boolean {
      return this.$accessor.configuration.competitionMode
    },

    scramblesEnabled (): boolean {
      return this.$accessor.configuration.scrambles
    },
  },

  watch: {
    selectedTimingMethod () {
      this.createNewTime()
    },

    selectedMode () {
      this.createNewTime()
    },
  },

  methods: {
    stateChanged (newState: State, oldState: State) {
      if (newState === oldState) return

      // Timing is complete
      if (newState === State.FINISHED) {
        this.storeTime()
      }

      // Timing was previously complete but is now being reset
      if (newState === State.READY && oldState === State.FINISHED) {
        this.$nextTick(() => {
          this.createNewTime(newState)
        })
      }
    },

    createNewTime (state: State = State.WAITING) {
      this.currentSolve = createTimingState(this.selectedMode)
      this.currentSolve.time.timingMethod = this.selectedTimingMethod
      this.currentSolve.state = state
    },

    async storeTime () {
      if (this.scramblesEnabled) {
        this.currentSolve.time.scramble = this.nextScramble
        this.nextScramble = scrambler.get()[0]
      }

      this.currentSolve.time.created = firebase.firestore.Timestamp.now()

      this.$store.dispatch('times/insert', this.currentSolve.time)
    },

    togglePenalty () {
      this.currentSolve.time.penalty = !this.currentSolve.time.penalty
      if (this.currentSolve.time.penalty) {
        this.currentSolve.time.dnf = false
      }

      this.$store.dispatch('times/patch', this.currentSolve.time)
    },

    toggleDnf () {
      this.currentSolve.time.dnf = !this.currentSolve.time.dnf
      if (this.currentSolve.time.dnf) {
        this.currentSolve.time.penalty = false
      }

      this.$store.dispatch('times/patch', this.currentSolve.time)
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

    h1
      margin: 0
      font-size: 18vw
      max-width: calc(100vw - 50px)

      @media (min-width: 570px)
        font-size: 100px

  .scramble
    display: inline-block
    font-size: 22px
    opacity: 0.6
    font-weight: 600
    margin-bottom: 30px

    p
      text-align: center
      margin: 0

  .adjustments
    display: flex

    @media (min-width: 570px)
      position: absolute
      top: 0
      right: -90px
      flex-direction: column
      justify-content: center
      height: 100%

    @media (max-width: 570px)
      flex-direction: row
      justify-content: center
      margin-top: 20px

      button::before, button::after
        content: "("
        opacity: 0.5

      button::after
        content: ")"

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
