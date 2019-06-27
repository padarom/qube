<script>

import { Line, mixins } from 'vue-chartjs'

export default {
    extends: Line,

    mixins: [ mixins.reactiveProp ],

    props: ['bits'],

    mounted () {
        this.renderChart(this.chartData, this.options)
    },

    computed: {
        options () {
            return {
                // tooltips: { enabled: false },
                // hover: { mode: null },
                bezierCurve: false,
                datasetFill: false,
                // eslint-disable-next-line
                tooltipTemplate: '<% if (label){% ><%= label %>: <%}%><%= value + ' %' %>',
                legendTemplate: '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<datasets.length; i++){%><li><span style=\'background-color:<%=datasets[i].pointColor%>\'></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
            }
        }
    }
}
</script>

<style>

</style>
