<template>
  <div />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TimingState, { State } from '~/types/TimingState'
import { merge } from 'lodash'

type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P]
}

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<TimingState>,
      required: true,
    },
  },

  methods: {
    setTime (time: number) {
      const state = this.value
      state.time.milliseconds = time

      this.$emit('input', state)
    },

    updateState (newState: RecursivePartial<TimingState>) {
      if (newState.state) {
        const oldState = this.value.state
        this.$emit('state-changed', newState.state, oldState)
      }

      this.$emit('input', merge(this.value, newState))
    },

    changeAccuracy (decimals: number) {
      const state = this.value
      state.time.decimals = decimals

      this.$emit('input', state)
    },
  },
})
</script>
