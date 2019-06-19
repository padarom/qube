<template>
    <aside class="statistics">
        <div class="last-times">
            <RecordedTime v-for="time in times" :key="time.uuid"
                :time="time.time"
                :uuid="time.uuid"
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

    data () {
        return {
            times: [
                { time: 1, uuid: 'abc-def' },
                { time: 100, uuid: 'abc-deg' },
                { time: 10090, uuid: 'abc-deh' },
                { time: 15020, uuid: 'abc-dei' },
                { time: 170030, uuid: 'abc-dej' }
            ]
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
