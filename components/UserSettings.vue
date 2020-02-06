<template>
    <div id="user-settings">
        Hallo
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AvailableTimingMethods } from './TimingMethods'

@Component
export default class extends Vue {
    get user () {
        return this.$store.state.user.user
    }
}
</script>
