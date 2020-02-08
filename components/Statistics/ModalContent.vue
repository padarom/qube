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

<script lang="ts">
import Vue from 'vue'
import RecordedTime from '../RecordedTime.vue'
import TimeChart from './TimeChart.vue'
import { minBy } from 'lodash'
import { getAverageOf } from './helpers'
import { Time } from '~/store/times'

export default Vue.extend({
  components: {
    RecordedTime, TimeChart
  },

  computed: {
    times (): Time[] {
      let times = this.$accessor.times.modeTimes
      times.sort((a, b) => new Date(a.timestamp) <= new Date(b.timestamp) ? -1 : 1)

      return times
    },

    reverseTimes (): Time[] {
      return this.times.slice().reverse()
    },

    bestTime (): Time | undefined {
      return minBy(this.times, 'time')
    },

    averagesOfFive (): Time[] {
      return getAverageOf(5, this.times)
    },

    lastAverageOfFive (): Time | undefined {
      return this.averagesOfFive.slice(-1).pop()
    },

    bestAverageOfFive (): Time | undefined {
      return minBy(this.averagesOfFive, 'time')
    },

    averagesOfTwelve (): Time[] {
      return getAverageOf(12, this.times)
    },

    lastAverageOfTwelve (): Time | undefined {
      return this.averagesOfTwelve.slice(-1).pop()
    },

    bestAverageOfTwelve (): Time | undefined {
      return minBy(this.averagesOfTwelve, 'time')
    },
  }
})
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
