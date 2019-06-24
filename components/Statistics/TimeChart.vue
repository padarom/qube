<script>
import { Line } from 'vue-chartjs'

export default {
    extends: Line,

    props: ['times'],

    mounted () {
        this.renderChart(this.chartdata, this.options)
    },

    methods: {
        timeDisplay (value) {
            return this.$options.filters.timeDisplay(value)
        }
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
                        label: (item) => this.timeDisplay(item.yLabel)
                    }
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                callback: label => this.timeDisplay(label)
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
