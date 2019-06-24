<template>
    <div class="timer">
        <h1 class="time" v-if="!record">
            {{ elapsed.minutes | padded }}:{{ elapsed.seconds | padded }}.{{ elapsed.milliseconds | padded }}
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

<script>
import KeyboardTimer from './TimingMethods/KeyboardTimer'
import shortid from 'shortid'

export default {
    data () {
        return {
            elapsed: {
                milliseconds: 0,
                seconds: 0,
                minutes: 0
            },
            timer: null,
            record: null
        }
    },

    mounted () {
        let timer = new KeyboardTimer()
        timer.onStart = this.startTimer
        timer.onStop = this.stopTimer
        timer.onReset = this.resetTimer
    },

    methods: {
        resetTimer () {
            this.elapsed.milliseconds = 0
            this.elapsed.seconds = 0
            this.elapsed.minutes = 0
            this.record = null
        },

        startTimer () {
            this.record = null
            this.timer = window.setInterval(() => {
                if (++this.elapsed.milliseconds >= 100) {
                    if (++this.elapsed.seconds >= 60) {
                        this.elapsed.minutes++
                        this.elapsed.seconds = 0
                    }

                    this.elapsed.milliseconds = 0
                }
            }, 10)
        },

        stopTimer () {
            window.clearInterval(this.timer)
            this.timer = null

            this.store()
        },

        store () {
            let record = {
                id: shortid.generate(),
                time: this.elapsed.minutes * 60 * 100 + this.elapsed.seconds * 100 + this.elapsed.milliseconds,
                timestamp: new Date(),
                dnf: false,
                penalty: false,
                timingMethod: this.$store.state.timingMethod
            }

            this.record = record
            this.$store.commit('addNewTime', record)
        },

        togglePenalty () {
            this.$set(this.record, 'penalty', !this.record.penalty)
            if (this.record.penalty) {
                this.$set(this.record, 'dnf', false)
            }

            this.$store.commit('updateTime', this.record)
        },

        toggleDnf () {
            this.$set(this.record, 'dnf', !this.record.dnf)
            if (this.record.dnf) {
                this.$set(this.record, 'penalty', false)
            }

            this.$store.commit('updateTime', this.record)
        }
    }
}
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
