<template>
  <vue-modal :name="name" v-bind="$attrs" v-on="$listeners">
    <a href="#" @click.prevent="$modal.hide(name)" class="close-modal">
      <i class="fal fa-times" />
    </a>

    <slot />
  </vue-modal>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="stylus">
.close-modal
  position: absolute
  top: 12px
  right: 12px

  font-size: 24px
  cursor: pointer
  color: $color-primary

  width: 42px
  height: 42px
  border-radius: 50%

  display: flex
  align-items: center
  justify-content: center

  &:hover
    background: $color-primary
    color: white !important
</style>
