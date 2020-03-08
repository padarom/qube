<template>
  <modal name="edit-time" :width="640" height="auto" @before-open="setTime">
    <div>
      <a @click="deleteTime">
        <i class="fa fa-trash" />
      </a>
    </div>
  </modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '~/components/Modals/Modal.vue'
import { AvailableTimingMethods } from '~/components/TimingMethods'
import SolvingTime from '~/types/SolvingTime'

export default Vue.extend({
  components: {
    Modal,
  },

  data () {
    return {
      time: null as SolvingTime | null,
    }
  },

  methods: {
    setTime (event: any) {
      this.time = event.params as SolvingTime
    },

    deleteTime () {
      this.$store.dispatch('times/delete', this.time!.id)
      this.$modal.hide('edit-time')
    },
  },
})
</script>
