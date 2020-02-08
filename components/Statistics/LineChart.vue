<script lang="ts">
import Vue, { PropType } from 'vue'
import { ChartOptions } from 'chart.js'
import { Line, mixins } from 'vue-chartjs'

export default Vue.extend({
  extends: Line,

  props: {
    options: {
      type: Object as PropType<ChartOptions>,
    },
  },

  // @TODO: Find out better typing for extending Line
  // and applying the mixin.

  mixins: [mixins.reactiveProp],

  watch: {
    options () {
      // @ts-ignore
      this.renderChart(this.chartData, this.options)
    }
  },

  mounted () {
    // @ts-ignore
    this.renderChart(this.chartData, this.options)
  }
})
</script>
