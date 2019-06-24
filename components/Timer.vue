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
import KeyboardTimer from './TimingMethods/KeyboardTimer'
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
    elapsed: ElapsedTime = {
        centiseconds: 0,
        seconds: 0,
        minutes: 0
    }

    mounted () {
        let timer = new KeyboardTimer()
        timer.onStart = this.startTimer
        timer.onStop = this.stopTimer
        timer.onReset = this.resetTimer
    }

    resetTimer () {
        this.elapsed.centiseconds = 0
        this.elapsed.seconds = 0
        this.elapsed.minutes = 0
        this.record = null
    }

    startTimer () {
        this.timer = window.setInterval(() => {
            if (++this.elapsed.centiseconds >= 100) {
                if (++this.elapsed.seconds >= 60) {
                    this.elapsed.minutes++
                    this.elapsed.seconds = 0
                }

                this.elapsed.centiseconds = 0
            }
        }, 10)
    }

    stopTimer () {
        window.clearInterval(this.timer)
        this.timer = null

        this.store()
    }

    store () {
        let record = {
            id: shortid.generate(),
            time: this.elapsed.minutes * 60 * 100 + this.elapsed.seconds * 100 + this.elapsed.centiseconds,
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
