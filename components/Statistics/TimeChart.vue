<script>
import { Line, mixins } from 'vue-chartjs'

export default {
    extends: Line,

    mixins: [mixins.reactiveProp],

    mounted () {
        this.renderChart(this.chartData, this.options)
    },

    methods: {
        timeDisplay (value) {
            return this.$options.filters.timeDisplay(value)
        }
    },

    computed: {
        options () {
            return {
                responsive: true,
                tooltips: {
                    callbacks: {
                        label: item => this.timeDisplay(item.yLabel),
                        beforeLabel: item => console.log(item),
                        title: () => ''
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: label => this.timeDisplay(label)
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
}
</script>
