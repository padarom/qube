<template>
    <div>
        <LineChart
            :chartData="chartData"
            :options="options"
            :width="1200"
            :style="{ width: 1200 }"
        />

        <label for="showAllValues">
            <input type="checkbox" name="showAllValues" id="showAllValues" v-model="showAllValues" />
            Show all values
        </label>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import moment from 'moment'
import LineChart from './LineChart.vue'
import { getAverageOf } from './helpers'
import { Time } from '~/store/times'
import { Line, mixins } from 'vue-chartjs'
import { ChartOptions, ChartData } from 'chart.js'

export default Vue.extend({
  props: {
    times: {
      type: Array as PropType<Time[]>,
      required: true,
    },

    averageOfFive: {
      type: Object as PropType<Time[]>,
      required: true,
    },

    averageOfTwelve: {
      type: Object as PropType<Time[]>,
      required: true,
    },
  },

  data () {
    return {
      showAllValues: false,
    }
  },

  components: { LineChart },

  methods: {
    timeDisplay (value: string | number | undefined): string {
      if (typeof value !== 'number') {
        return ''
      }

      return this.$options.filters?.timeDisplay(value)
    }
  },

  computed: {
    chartData (): ChartData {
      let labels = this.times.map(time => time.timestamp)

      let generateAverage = (list: Time[], label: string, color: string) => ({
        label,
        tension: 0.3,
        fill: false,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: color,
        pointRadius: 5,
        pointBorderColor: 'transparent',
        data: list
          .map(time => ({
            ...time,
            x: labels.indexOf(time.timestamp),
            y: time.time
          }))
      })

      return {
        labels: [...labels.keys()],
        datasets: [
          {
            label: 'Individual times',
            lineTension: 0,
            fill: false,
            backgroundColor: 'transparent',
            borderColor: 'hsla(0, 90%, 60%, 0.7)',
            borderWidth: 2,
            showLine: false,
            data: this.times.map(time => ({ ...time, y: time.time }))
          },
          generateAverage(this.averageOfFive, 'Average of 5', 'hsl(215, 60%, 50%)'),
          generateAverage(this.averageOfTwelve, 'Average of 12', 'hsl(90, 60%, 40%)')
        ]
      }
    },

    options (): ChartOptions {
      // Calculate the standard deviation so that we can restrict the chart
      let mean = this.times.reduce((sum, cur) => sum + cur.time, 0) / this.times.length
      let squaredDifferences = this.times.map(cur => Math.pow(cur.time - mean, 2))
      let squaredMean = squaredDifferences.reduce((sum, cur) => sum + cur, 0) / this.times.length
      let standardDeviation = Math.sqrt(squaredMean)

      let firstTime = this.times.length ? this.times[0].time : 0

      return {
        responsive: true,
        tooltips: {
          callbacks: {
            label: item => this.timeDisplay(item.yLabel),
            // beforeLabel: item => console.log(item),
            title: (items, object) => {
              let { datasetIndex, index } = items[0]
              let datasets = object.datasets
              let value = object.datasets![datasetIndex as number].data![index as number] as Time

              return moment(value.timestamp).format('LLL')
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              min: this.showAllValues ? undefined : Math.max(firstTime - standardDeviation, 0),
              max: this.showAllValues ? undefined : firstTime + standardDeviation,
              callback: label => this.timeDisplay(parseInt(label))
            }
          }],
          xAxes: [{
            ticks: {
              display: false
            }
          }]
        }
      }
    }
  }
})
</script>
