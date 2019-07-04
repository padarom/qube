<template>
    <div id="statistics-modal">
        <section class="chart">
            <TimeChart :times="times" />
        </section>

        <aside class="statistics" v-show="false">
            <ul>
                <li v-for="time in reverseTimes" :key="time.id">
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
        reverseTimes () {
            return this.times.slice().reverse()
        },

        times () {
            let times = this.$store.state.times.slice()
            times.sort((a, b) => new Date(a.timestamp) <= new Date(b.timestamp) ? -1 : 1)

            return times
        }
    }
}
</script>

<style lang="stylus" scoped>
.statistics li
    list-style: none
</style>
