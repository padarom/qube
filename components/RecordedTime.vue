<template>
    <div class="recorded-time">
        <span class="flag dnf" v-if="time.dnf">DNF</span>
        <span class="flag penalty" v-if="time.penalty">+2</span>

        <span class="time">{{ time | timeDisplay }}</span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    time: {
      type: Object,
      required: true
    }
  }
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

    .flag
        font-size: 11px
        margin-right: 3px
        opacity: 0.9

    &:last-of-type
        margin-bottom: 0

    for num in (1..5)
        &:nth-of-type({num})
            color: lighten($color-primary, num * 12%)

    &:nth-of-type(n+6)
        color: lighten($color-primary, 5 * 12%)
</style>
