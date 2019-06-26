<template>
    <div id="settings">
        <section class="timing">
            <h3>Timing method</h3>
            <ul>
                <li>
                    <input type="radio" id="keyboard" :value="timingMethods.Keyboard" v-model="timingMethod">
                    <label for="keyboard">
                        <span class="title">Keyboard</span>
                        <span class="description">Click anywhere on the screen to start and stop the timer</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="stackmat" :value="timingMethods.Stackmat" v-model="timingMethod">
                    <label for="stackmat">
                        <span class="title">Stackmat G4</span>
                        <span class="description">Click anywhere on the screen to start and stop the timer</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="accelerometer" :value="timingMethods.Accelerometer" v-model="timingMethod">
                    <label for="accelerometer">
                        <span class="title">Accelerometer</span>
                        <span class="description">Click anywhere on the screen to start and stop the timer</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="touch" :value="timingMethods.Touch" v-model="timingMethod">
                    <label for="touch">
                        <span class="title">Touch</span>
                        <span class="description">Click anywhere on the screen to start and stop the timer</span>
                    </label>
                </li>
            </ul>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { types } from '~/store/mutations'
import { AvailableTimingMethods } from './TimingMethods'

@Component
export default class extends Vue {
    get timingMethod () {
        return this.$store.state.timingMethod
    }

    set timingMethod (value) {
        this.$store.commit(types.SET_TIMING_METHOD, value)
    }

    get timingMethods (): typeof AvailableTimingMethods {
        return AvailableTimingMethods
    }
}
</script>

<style scoped lang="stylus">
    .timing
        li
            display: flex
            text-align: left
            list-style: none

        label
            padding-left: 20px
            padding-bottom: 10px

        .title
            display: block
            font-weight: bold

</style>
