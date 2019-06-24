<template>
    <div id="statistics-modal">
        <TimeChart :times="times" />

        <aside class="statistics">
            <ul>
                <li v-for="time in times" :key="time.id">
                    <RecordedTime :time="time" />
                </li>
            </ul>
        </aside>
    </div>
</template>

<script>
import RecordedTime from '../RecordedTime'
import TimeChart from './TimeChart'

export default {
    components: {
        RecordedTime, TimeChart
    },

    computed: {
        times () {
            return this.$store.state.times
        }
    }
}
</script>
