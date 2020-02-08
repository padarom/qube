<script type="ts">
import Vue from 'vue'
import { Line, mixins } from 'vue-chartjs'

export default Vue.extend({
  extends: Line,

  props: [ 'options' ],

  mixins: [ mixins.reactiveProp ],

  watch: {
    options () {
      this.renderChart(this.chartData, this.options)
    }
  },

  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
</script>
