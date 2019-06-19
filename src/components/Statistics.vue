<template>
    <aside class="statistics">
        <div class="last-times">
            <RecordedTime v-for="time in times" :key="time.uuid"
                :time="time.time"
                :uuid="time.uuid"
                :dnf="time.dnf"
                :penalty="time.penalty"
            />
        </div>
    </aside>
</template>

<script>
import RecordedTime from './RecordedTime'

export default {
    components: {
        RecordedTime
    },

    computed: {
        times () {
            return this.$store.state.times
        }
    }
}
</script>

<style scoped>
    .statistics {
        position: absolute;
        right: 0;
        margin-right: 16px;
    }
</style>
