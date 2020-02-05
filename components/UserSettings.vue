<template>
    <div id="user-settings">
        Hallo
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AvailableTimingMethods } from './TimingMethods'

export default Vue.extend({
  computed: {
    user () {
      return this.$store.state.user.user
    },
  },
})
</script>
