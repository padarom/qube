<template>
  <div class="recorded-time" @click="editTime">
    <span class="flag dnf" v-if="time.dnf">DNF</span>
    <span class="flag penalty" v-if="time.penalty">+2</span>

    <span class="time">
      <span class="accurate">{{ time | timeDisplay }}</span><span class="inaccurate" v-for="n in (3 - time.decimals)" :key="n">-</span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import SolvingTime from '~/types/SolvingTime'

export default Vue.extend({
  props: {
    time: {
      type: Object as PropType<SolvingTime>,
      required: true,
    },
  },

  data () {
    return {}
  },

  computed: {
    competitionMode (): boolean {
      return this.$accessor.configuration.competitionMode
    },
  },

  methods: {
    editTime () {
      this.$modal.show('edit-time', this.time)
    },
  },
})
</script>

<style lang="stylus">
.recorded-time
  font-size: 20px
  text-align: right
  margin-bottom: 3px
  font-weight: bold
  letter-spacing: 1px
  transition: color 1s

  .time .inaccurate
    opacity: 0

  .flag
    font-size: 11px
    margin-right: 3px
    opacity: 0.7

  &:last-of-type
    margin-bottom: 0

  for num in (1..5)
    &:nth-of-type({num})
      color: lighten($color-primary, num * 12%)

  &:nth-of-type(n+6)
    color: lighten($color-primary, 5 * 12%)
</style>
