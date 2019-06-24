<template>
    <aside class="statistics">
        <ul>
            <li v-for="time in times" :key="time.id">
                <RecordedTime :time="time" />
            </li>
        </ul>
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
