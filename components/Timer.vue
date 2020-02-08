<template>
    <div>
        <div class="timer">
            <h1 class="time" v-if="!record">
                {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.milliseconds | padded(this.accuracy) }}
            </h1>
            <h1 class="time filtered" v-else>
                {{ record | timeDisplay(this.accuracy) }}
            </h1>

            <div class="adjustments" v-if="record">
                <button @click="togglePenalty" :class="{ active: record.penalty }">+2</button>
                <button @click="toggleDnf" :class="{ active: record.dnf }">DNF</button>
            </div>
        </div>

        <aside class="hint">
            <span v-html="methodHint" />
        </aside>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TimingMethods, { AvailableTimingMethods } from './TimingMethods'
import TimeEmitter from './TimeEmitter'
import shortid from 'shortid'
import { Time } from '../store/times'
import TimingMethod from './TimingMethods/TimingMethod'

type ElapsedTime = {
    centiseconds: number,
    seconds: number,
    minutes: number
}

export default Vue.extend({
  data () {
    return {
      record: null as Time | null,
      elapsedMilliseconds: 0,
      timeEmitter: new TimeEmitter(),
      method: null as TimingMethod | null,
      methodHint: '',
      accuracy: 3,
    }
  },

  mounted () {
    this.timeEmitter.addEventListener(TimeEmitter.Events.TIMER_RESET, () => this.resetTimer())
    this.timeEmitter.addEventListener(TimeEmitter.Events.TIME_UPDATED, (e) => this.updateTime(e))
    this.timeEmitter.addEventListener(TimeEmitter.Events.TIMER_ENDED, () => this.store())
  },

  computed: {
    elapsed () {
        let accuracy = Math.pow(10, this.accuracy)
        let milliseconds = Math.round(this.elapsedMilliseconds / (1000 / accuracy))

        return {
            milliseconds: milliseconds % accuracy,
            seconds: Math.floor(milliseconds / accuracy) % 60,
            minutes: Math.floor(milliseconds / accuracy / 60)
        }
    },

    timingMethod (): AvailableTimingMethods {
      return this.$store.state.configuration.timingMethod
    },
  },

  watch: {
    timingMethod: {
      immediate: true,
      handler (value: AvailableTimingMethods) {
        if (this.method) this.method.teardown()
        delete this.method

        let TimingMethodConstructor = TimingMethods[value] as any
        this.method = new TimingMethodConstructor()
        this.method!.attachEmitter(this.timeEmitter)

        this.methodHint = this.method!.hint()
      }
    }
  },

  methods: {
    resetTimer () {
      this.elapsedMilliseconds = 0
      this.record = null
    },

    updateTime (e: any) {
      this.elapsedMilliseconds = e.detail
    },

    async store (e: any) {
      this.elapsedMilliseconds = e.detail
      
      let record = {
        id: shortid.generate(),
        time: Math.floor(this.elapsedMilliseconds / 10),
        timestamp: new Date(),
        dnf: false,
        penalty: false,
        mode: this.$accessor.configuration.mode,
        timingMethod: this.$accessor.configuration.timingMethod
      }

      this.record = record
      this.$store.dispatch('times/insert', record)
    },

    togglePenalty () {
      let record = this.record as Time
      this.$set(record as Time, 'penalty', !record.penalty)
      if (record.penalty) {
        this.$set(record, 'dnf', false)
      }

      this.$store.dispatch('times/patch', this.record)
    },

    toggleDnf () {
      let record = this.record as Time
      this.$set(record, 'dnf', !record.dnf)
      if (record.dnf) {
        this.$set(record, 'penalty', false)
      }

      this.$store.dispatch('times/patch', this.record)
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
