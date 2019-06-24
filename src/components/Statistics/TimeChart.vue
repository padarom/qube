<script>
import { Line } from 'vue-chartjs'
import timeDisplay from '@/filters/TimeDisplay'

export default {
    extends: Line,

    props: ['times'],

    mounted () {
        this.renderChart(this.chartdata, this.options)
    },

    computed: {
        chartdata () {
            return {
                datasets: [
                    {
                        label: '',
                        data: this.times
                            .filter(time => !!time.timestamp)
                            .map(time => ({
                                x: time.timestamp,
                                y: time.time
                            }))
                    }
                ]
            }
        },

        options () {
            return {
                tooltips: {
                    callbacks: {
                        label: (item) => timeDisplay(item.yLabel)
                    }
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                callback: label => timeDisplay(label)
                            }
                        }
                    ],
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear',
                        time: { unit: 'day' }
                    }]
                }
            }
        }
    }
}
</script>
