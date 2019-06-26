<template>
    <div>
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

            <div class="a">
                <span class="dot" v-for="(value, ind) in values" :key="ind" :class="`val-${value} ${ind > startIndex ? 'act' : ''}`">
                    .
                </span>
            </div>
        </div>

        <aside class="hint">
            <span v-html="methodHint" />
        </aside>
    </div>
</template>

<script lang="ts">
import TimingMethods, { AvailableTimingMethods } from './TimingMethods'
import TimeEmitter from './TimeEmitter'
import shortid from 'shortid'
import { Component, Watch, Vue } from 'vue-property-decorator'
import { Time } from '../store/state'
import { types } from '../store/mutations'
import TimingMethod from './TimingMethods/TimingMethod'

type ElapsedTime = {
    centiseconds: number,
    seconds: number,
    minutes: number
}

@Component
class Timer extends Vue {
    record: Time | null = null
    elapsedMilliseconds = 0
    timeEmitter = new TimeEmitter()
    method: TimingMethod | null = null
    methodHint = ''

    // Debug only
    values: any = []
    startIndex: any = 0

    get elapsed () {
        let centiseconds = Math.floor(this.elapsedMilliseconds / 10)

        return {
            centiseconds: centiseconds % 100,
            seconds: Math.floor(centiseconds / 100) % 60,
            minutes: Math.floor(centiseconds / 100 / 60)
        }
    }

    get timingMethod (): AvailableTimingMethods {
        return this.$store.state.timingMethod
    }

    @Watch('timingMethod', { immediate: true })
    onTimingMethodChanged (value: AvailableTimingMethods) {
        if (this.method) this.method.teardown()
        delete this.method

        let TimingMethodConstructor = TimingMethods[value] as any
        this.method = new TimingMethodConstructor()
        this.method!.attachEmitter(this.timeEmitter)

        this.methodHint = this.method!.hint()
    }

    mounted () {
        this.timeEmitter.addEventListener(TimeEmitter.Events.TIMER_RESET, () => this.resetTimer())
        this.timeEmitter.addEventListener(TimeEmitter.Events.TIME_UPDATED, (e) => this.updateTime(e))
        this.timeEmitter.addEventListener(TimeEmitter.Events.TIMER_ENDED, () => this.store())

        // Debug only
        document.addEventListener('my_custom_event', (e) => {
            // @ts-ignore
            let { bits, startIndex } = e.detail

            this.startIndex = startIndex
            this.$set(this, 'values', bits)
        })
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
