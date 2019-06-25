<template>
    <div class="timer">
        <h1 class="time" v-if="!record">
            {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.centiseconds | padded }}
        </h1>
        <h1 class="time filtered" v-else>
            {{ record | timeDisplay }}
        </h1>

        <div class="adjustments" v-if="record">
            <button @click="togglePenalty" :class="{ active: record.penalty }">+2</button>
            <button @click="toggleDnf" :class="{ active: record.dnf }">DNF</button>
        </div>
    </div>
</template>

<script lang="ts">
import TimingMethods from './TimingMethods'
import TimeEmitter from './TimeEmitter'
import shortid from 'shortid'
import { Component, Vue } from 'vue-property-decorator'
import { Time } from '../store/state'
import { types } from '../store/mutations'

type ElapsedTime = {
    centiseconds: number,
    seconds: number,
    minutes: number
}

@Component
class Timer extends Vue {
    record: Time | null = null
    timer: any
    elapsedMilliseconds: number = 0

    get elapsed () {
        let centiseconds = Math.floor(this.elapsedMilliseconds / 10)

        return {
            centiseconds: centiseconds % 100,
            seconds: Math.floor(centiseconds / 100) % 60,
            minutes: Math.floor(centiseconds / 100 / 60)
        }
    }

    mounted () {
        let timeEmitter = new TimeEmitter()
        let method = new TimingMethods.Keyboard()
        method.attachEmitter(timeEmitter)

        timeEmitter.addEventListener(TimeEmitter.Events.TIMER_RESET, () => this.resetTimer())
        timeEmitter.addEventListener(TimeEmitter.Events.TIME_UPDATED, (e) => this.updateTime(e))
        timeEmitter.addEventListener(TimeEmitter.Events.TIMER_ENDED, () => this.store())
    }

    resetTimer () {
        this.elapsedMilliseconds = 0
        this.record = null
    }

    updateTime (e: any) {
        this.elapsedMilliseconds = e.detail
    }

    store () {
        let record = {
            id: shortid.generate(),
            time: Math.floor(this.elapsedMilliseconds / 10),
            timestamp: new Date(),
            dnf: false,
            penalty: false,
            timingMethod: this.$store.state.timingMethod
        }

        this.record = record
        this.$store.commit(types.ADD_TIME, record)
    }

    togglePenalty () {
        let record = this.record as Time
        this.$set(record as Time, 'penalty', !record.penalty)
        if (record.penalty) {
            this.$set(record, 'dnf', false)
        }

        this.$store.commit(types.UPDATE_TIME, this.record)
    }

    toggleDnf () {
        let record = this.record as Time
        this.$set(record, 'dnf', !record.dnf)
        if (record.dnf) {
            this.$set(record, 'penalty', false)
        }

        this.$store.commit(types.UPDATE_TIME, this.record)
    }
}

export default Timer
</script>

<style lang="stylus">
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
