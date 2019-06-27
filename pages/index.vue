<template>
    <div id="app">
        <BackgroundAnimation />

        <div class="">
            <select v-model="mode">
                <option value="3x3">Rubik's Cube</option>
                <option value="4x4">Rubik's Professor</option>
            </select>
        </div>

        <Stackmat-Decoder :width="1900" :height="600" :chartData="chartData"/>
        <button @click="log = true" style="position:absolute;top:10px;left:10px;">Sample now</button>
        <Timer />

        <nav class="navigation">
            <ul>
                <li v-if="user">{{ user.displayName ? user.displayName : user.email }}</li>
                <li v-else @click="$refs.login.open()">Login</li>
                <li @click="$refs.statistics.open()">Show all times</li>
                <li @click="$refs.settings.open()"><i class="fal fa-cogs"></i></li>
            </ul>
        </nav>

        <RecentTimes />

        <sweet-modal ref="statistics">
            <StatisticsModalContent />
        </sweet-modal>

        <sweet-modal ref="settings">
            <AppSettings />
        </sweet-modal>

        <sweet-modal ref="login" width="300px"></sweet-modal>
    </div>
</template>

<script>
import StackmatDecoder from '~/components/StackmatDecoder'
import BackgroundAnimation from '~/components/BackgroundAnimation'
import AppSettings from '~/components/AppSettings'
import RecentTimes from '~/components/RecentTimes'
import ModalContent from '~/components/Statistics/ModalContent'
import Timer from '~/components/Timer'
import { types } from '~/store/mutations'

import { SweetModal } from 'sweet-modal-vue'

export default {
    components: {
        BackgroundAnimation, StackmatDecoder, AppSettings, Timer, RecentTimes, SweetModal, StatisticsModalContent: ModalContent
    },

    data () {
        return {
            audio: {},
            log: false
        }
    },

    mounted () {
        document.addEventListener('my_custom_event', (e) => {
            if (!this.log) return
            this.log = false

            this.$set(this, 'audio', e.detail)
        })
    },

    computed: {
        mode: {
            get () {
                return this.$store.state.mode
            },
            set (value) {
                this.$store.commit('switchMode', value)
            }
        },

        user () {
            return this.$store.state.user
        },

        chartData () {
            if (!this.audio.signal) return {}
            let points = this.audio.signal.length

            console.log(this.audio.startIndex)

            return {
                labels: [...new Array(points).keys()],
                datasets: [{
                    label: 'Raw',
                    data: this.audio.signal,
                    borderColor: 'green',
                    lineTension: 0,
                    pointRadius: 0,
                    borderWidth: 1
                }, {
                    label: 'Binary',
                    data: this.audio.bits.map(i => i ? 0.1 : -0.1),
                    borderColor: 'black',
                    lineTension: 0,
                    pointRadius: 0
                }, {
                    label: 'Signal after start',
                    data: [...new Array(points).keys()].map(k => k >= this.audio.startIndex ? 0.3 : 0),
                    borderColor: 'red',
                    lineTension: 0,
                    pointRadius: 0,
                    borderWidth: 1
                }]
            }
        }
    }
}
</script>

<style lang="stylus">
    .navigation li
        cursor: pointer
</style>
