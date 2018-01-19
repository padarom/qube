<template>
  <div>{{ time | timeDisplay }}</div>
</template>

<script>
export default {
  props: {
    // UUID for this singular time, so that we can later identify it with the API
    uuid: {
      type: String,
      required: true
    },

    // The recorded time in hundredth of seconds (10ms)
    time: {
      type: Number,
      required: true
    },

    // A flag designating whether the time should be counted as DNF
    dnf: {
      type: Boolean,
      default: false
    },

    // A flag designating whether a +2 seconds penalty was added to the time
    penalty: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.recorded-time {
  font-family: 'Anonymous Pro', monospace;
  font-size: 10px;
}

</style>
