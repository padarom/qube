<template>
  <div />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SolvingTime } from '~/types/SolvingTime'

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<SolvingTime>,
      required: true,
    },
  },

  methods: {
    setTime (time: number) {
      const updatedTime: SolvingTime = {
        ...this.value,
        milliseconds: time,
      }

      this.$emit('input', updatedTime)
    },
  },
})
</script>
