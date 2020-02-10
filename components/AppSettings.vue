<template>
    <div id="settings">
        <section class="timing">
            <h3>Timing method</h3>
            <ul>
                <li>
                    <input type="radio" id="keyboard" :value="timingMethods.Keyboard" v-model="timingMethod">
                    <label for="keyboard">
                        <span class="title">Keyboard</span>
                        <span class="description">Start and stop the timer by pressing the space key on your keyboard</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="stackmat" :value="timingMethods.Stackmat" v-model="timingMethod">
                    <label for="stackmat">
                        <span class="title">Stackmat</span>
                        <span class="description">Attach a Stackmat timer to your computer via its microphone port and time yourself like you would on tournaments</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="touch" :value="timingMethods.Touch" v-model="timingMethod">
                    <label for="touch">
                        <span class="title">Touch</span>
                        <span class="description">Click anywhere on the screen to start and stop the timer</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="accelerometer" :value="timingMethods.Accelerometer" v-model="timingMethod">
                    <label for="accelerometer">
                        <span class="title">Accelerometer</span>
                        <span class="description">Put your phone down on the table and start the timer by lifting your hands off the screen. Once you drop your hands back anywhere on the table the timer stops<br>
                            <i style="font-size:80%;opacity:0.8;">Be aware that this method could prematurely stop your times if you accidentally drop the cube or hit the table during your solve.</i></span>
                    </label>
                </li>
            </ul>
        </section>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AvailableTimingMethods } from './TimingMethods'

export default Vue.extend({
  computed: {
    timingMethod: {
      get () {
        return this.$accessor.configuration.timingMethod
      },

      set (value: AvailableTimingMethods) {
        this.$accessor.configuration.setTimingMethod(value)
      },
    },

    timingMethods (): typeof AvailableTimingMethods {
      return AvailableTimingMethods
    }
  }
})
</script>

<style scoped lang="stylus">
  .timing
    li
      display: flex
      text-align: left
      list-style: none

    label
      padding-left: 20px
      padding-bottom: 15px

    .title
      display: block
      font-weight: bold

    h3
      text-align: center
</style>
