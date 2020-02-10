<template>
    <div id="user-settings">
        Hallo
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    user () {
      return this.$accessor.user.user
    },
  },
})
</script>
