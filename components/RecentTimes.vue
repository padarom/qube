<template>
    <aside class="recent">
        <transition-group tag="div" name="list" class="last-times">
            <RecordedTime v-for="time in times" :key="time.id" :time="time" />
        </transition-group>
    </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import RecordedTime from './RecordedTime.vue'
import { SolvingTime } from '~/store/times'

export default Vue.extend({
  components: {
    RecordedTime
  },

  computed: {
    times (): SolvingTime[] {
      return this.$accessor.times.modeTimes.slice(0, 5)
    },
  },
})
</script>

<style lang="stylus" scoped>
  .recent
    position: absolute
    right: 0
    margin-right: 16px

  .list-enter-active, .list-leave-active
    transition: all 1s

  .list-enter
    position: relative
    z-index: 3
    opacity: 0
    margin-bottom: -27px

  .list-leave-to
    opacity: 0
    margin-bottom: -30px !important
</style>
