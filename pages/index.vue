<template>
    <div id="app">
        <BackgroundAnimation />

        <div class="">
            <select v-model="mode">
                <option value="3x3">Rubik's Cube</option>
                <option value="4x4">Rubik's Professor</option>
            </select>
        </div>

        <Stackmat-Decoder :chartData="chartData" :styles="{ width: '100vw' }" />
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
            audio: {}
        }
    },

    mounted () {
        document.addEventListener('my_custom_event', (e) => {
            if (Object.keys(this.audio).length) return

            console.log(e.detail.signal)
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

            return {
                labels: [...new Array(points).keys()],
                datasets: [{
                    label: 'AudioData',
                    strokeColor: 'rgba(151,187,205,1)',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data: this.audio.signal,
                    error: [0.5]
                }, {
                    label: 'Average',
                    strokeColor: 'rgba(245, 15, 15, 0.5)',
                    pointColor: 'rgba(245, 15, 15, 0.5)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: [
                    ]
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
