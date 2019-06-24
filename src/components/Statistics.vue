<template>
    <aside class="statistics">
        <transition-group tag="div" name="list" class="last-times">
            <RecordedTime v-for="time in times" :key="time.id" :time="time" />
        </transition-group>
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
            return this.$store.state.times.slice(0, 5)
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

    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }

    .list-enter {
        position: relative;
        z-index: 3;
        opacity: 0;
        margin-bottom: -27px;
    }

    .list-leave-to {
        opacity: 0;
        margin-bottom: -30px !important;
    }
</style>
