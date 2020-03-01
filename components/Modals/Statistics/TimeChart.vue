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
import { getAverageOf } from './helpers'
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
          .map(time => ({
            ...time,
            x: time.created.toDate(),
            y: time.milliseconds
          }))
      })

      return {
        // labels: [...labels.keys()],
        datasets: [
          {
            label: 'Individual times',
            lineTension: 0,
            fill: false,
            backgroundColor: 'transparent',
            borderColor: 'hsla(0, 90%, 60%, 0.7)',
            borderWidth: 2,
            showLine: false,
            data: this.times.map(time => ({ ...time, x: time.created.toDate(), y: time.milliseconds }))
          },
          generateAverage(this.averageOfFive, 'Average of 5', 'hsl(215, 60%, 50%)'),
          generateAverage(this.averageOfTwelve, 'Average of 12', 'hsl(90, 60%, 40%)')
        ]
      }
    },

    options (): ChartOptions {
      function getObject (item: Chart.ChartTooltipItem, data: Chart.ChartData): SolvingTime {
        const { datasetIndex, index } = item
        const datasets = data.datasets
        return data.datasets![datasetIndex as number].data![index as number] as SolvingTime
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
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: label => this.timeDisplay(parseInt(label)),
            }
          }],
          xAxes: [{
            type: 'time',
            distribution: 'linear',
          }]
        }
      }
    }
  }
})
</script>
