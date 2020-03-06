<template>
    <div>
        <LineChart
            :chartData="chartData"
            :options="options"
            :width="1200"
            :style="{ width: 1200 }"
        />
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import moment from 'moment'
import LineChart from './LineChart.vue'
import { getAverageOf, timeInMilliseconds } from './helpers'
import SolvingTime from '~/types/SolvingTime'
import { Line, mixins } from 'vue-chartjs'
import { ChartOptions, ChartData } from 'chart.js'

export default Vue.extend({
  props: {
    times: {
      type: Array as PropType<SolvingTime[]>,
      required: true,
    },

    averageOfFive: {
      type: Array as PropType<SolvingTime[]>,
      required: true,
    },

    averageOfTwelve: {
      type: Array as PropType<SolvingTime[]>,
      required: true,
    },
  },

  data () {
    return {
    }
  },

  components: { LineChart },

  methods: {
    timeDisplay (value: any): string {
      return this.$options.filters?.timeDisplay(value)
    }
  },

  computed: {
    chartData (): ChartData {
      const generateAverage = (list: SolvingTime[], label: string, color: string) => ({
        label,
        tension: 0.3,
        fill: false,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: color,
        pointRadius: 5,
        pointBorderColor: 'transparent',
        data: list
          .filter(item => !item.dnf) // We don't want to include penalty times in our statistics calculations
          .map(time => ({
            ...time,
            x: time.created.toDate(),
            y: timeInMilliseconds(time)
          }))
      })

      const totalAverage = getAverageOf(0, this.times)
      const averageDataset = generateAverage(totalAverage, '', '')
      const standardDeviation = this.times.reduce((acc, cur, i) => {
        if (cur.dnf) return acc
        const time = timeInMilliseconds(cur)

        // Subtract the mean and square the result
        const squareOfDifference = Math.pow(time - totalAverage[i].milliseconds, 2)
        acc.sumOfSquares.push(squareOfDifference)

        // Work out the mean of the squared differences
        const sumOfSquares = acc.sumOfSquares.reduce((acc, cur) => acc + cur)
        const meanOfSquares = sumOfSquares / acc.sumOfSquares.length

        // Add the standard deviation to the accumulator
        const sd = Math.sqrt(meanOfSquares)
        acc.sd.push(sd)

        // If a datapoint is more than 2 SD's away from the mean, exclude it
        // and just push the previous SD to fill in this entry.
        if (time > totalAverage[i].milliseconds + 2 * sd) {
          acc.sd.pop()
          acc.sumOfSquares.pop()

          acc.sd.push(acc.sd[acc.sd.length - 1])
          acc.sumOfSquares.push(acc.sumOfSquares[acc.sumOfSquares.length - 1])
        }

        return acc
      }, {
        sumOfSquares: [] as number[],
        sd: [] as number[],
      }).sd

      return {
        datasets: [
          generateAverage(this.averageOfFive, 'Average of 5', 'hsl(215, 60%, 50%)'),
          generateAverage(this.averageOfTwelve, 'Average of 12', 'hsl(90, 60%, 40%)'),
          {
            label: 'Individual times',
            lineTension: 0,
            fill: false,
            backgroundColor: 'transparent',
            borderColor: 'hsla(0, 90%, 60%, 0.7)',
            borderWidth: 2,
            showLine: false,
            data: this.times.map(time => ({
              ...time,
              x: time.created.toDate(),
              y: timeInMilliseconds(time)
            }))
          },
          {
            ...averageDataset,
            data: averageDataset.data.map(
              (dp, i) => ({ ...dp, y: dp.y - standardDeviation[i] })
            ).filter((v, i) => i > 6),
            fill: '+1',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderColor: 'transparent',
            pointRadius: 0,
          },
          {
            ...averageDataset,
            data: averageDataset.data.map(
              (dp, i) => ({ ...dp, y: dp.y + standardDeviation[i] })
            ).filter((v, i) => i > 6),
            borderColor: 'transparent',
            pointRadius: 0,
          },
        ]
      }
    },

    options (): ChartOptions {
      function getObject (item: Chart.ChartTooltipItem, data: Chart.ChartData): SolvingTime {
        const { datasetIndex, index } = item
        const datasets = data.datasets
        return data.datasets![datasetIndex!].data![index!] as SolvingTime
      }

      return {
        responsive: true,
        tooltips: {
          callbacks: {
            label: (item, data) => {
              const object = getObject(item, data)
              return this.timeDisplay(object)
            },
            title: (items, data) => {
              const object = getObject(items[0], data)
              return moment(object.created.toDate()).format('LLL')
            }
          },
          filter: (item, data) => {
            // TODO: Figure out why this causes errors to be logged,
            // when hovering over the standard deviation boundary.
            const dataset = data.datasets![item.datasetIndex!]
            return !!dataset.label
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: label => this.timeDisplay(parseInt(label)),
            }
          }],
          xAxes: [{
            type: 'time',
            distribution: 'series',
            ticks: {
              display: false,
            },
          }]
        }
      }
    }
  }
})
</script>
