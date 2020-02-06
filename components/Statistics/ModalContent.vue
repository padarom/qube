<template>
    <div id="statistics-modal">
        <section class="chart">
            <TimeChart :times="times" :averageOfFive="averagesOfFive" :averageOfTwelve="averagesOfTwelve" />
        </section>

        <section class="textual">
            <div class="column statistics">
                <dl>
                    <dt v-if="times.length">Best time</dt>
                    <dd v-if="times.length">{{ bestTime.time | timeDisplay }}</dd>

                    <dt>Average of 5</dt>
                    <dd>
                        <div v-if="lastAverageOfFive">{{ lastAverageOfFive.time | timeDisplay }}</div>
                        <div v-if="bestAverageOfFive">Best: {{ bestAverageOfFive.time | timeDisplay }}</div>
                    </dd>

                    <dt>Average of 12</dt>
                    <dd>
                        <div v-if="lastAverageOfTwelve">{{ lastAverageOfTwelve.time | timeDisplay }}</div>
                        <div v-if="bestAverageOfTwelve">Best: {{ bestAverageOfTwelve.time | timeDisplay }}</div>
                    </dd>
                </dl>
            </div>

            <div class="column list">
                <ul>
                    <li v-for="time in reverseTimes" :key="time.id">
                        <RecordedTime :time="time" />
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
import RecordedTime from '../RecordedTime'
import TimeChart from './TimeChart'
import { minBy } from 'lodash'
import { getAverageOf } from './helpers'

export default {
    components: {
        RecordedTime, TimeChart
    },

    computed: {
        reverseTimes () {
            return this.times.slice().reverse()
        },

        times () {
            let times = this.$store.getters['times/modeTimes'].slice()
            times.sort((a, b) => new Date(a.timestamp) <= new Date(b.timestamp) ? -1 : 1)

            return times
        },

        bestTime () {
            return minBy(this.times, 'time')
        },

        averagesOfFive () {
            return getAverageOf(5, this.times)
        },

        lastAverageOfFive () {
            return this.averagesOfFive.slice(-1).pop()
        },

        bestAverageOfFive () {
            return minBy(this.averagesOfFive, 'time')
        },

        averagesOfTwelve () {
            return getAverageOf(12, this.times)
        },

        lastAverageOfTwelve () {
            return this.averagesOfTwelve.slice(-1).pop()
        },

        bestAverageOfTwelve () {
            return minBy(this.averagesOfTwelve, 'time')
        }
    }
}
</script>

<style lang="stylus" scoped>
.textual
    display: flex
    flex-direction: row
    justify-content: space-between

    .column
        flex: 1

.statistics
    text-align: left

.list
    max-height: 300px
    overflow-y: scroll

    li
        list-style: none
</style>
