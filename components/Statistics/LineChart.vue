<script>
import { Line, mixins } from 'vue-chartjs'

export default {
    extends: Line,

    props: [ 'options' ],

    mixins: [ mixins.reactiveProp ],

    watch: {
        options () {
            this.renderChart(this.chartData, this.options)
            console.log('changed')
        }
    },

    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}
</script>
