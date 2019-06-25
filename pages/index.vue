<template>
    <div id="app">
        <BackgroundAnimation v-if="false" />

        <div class="">
            <select v-model="mode">
                <option value="3x3">Rubik's Cube</option>
                <option value="4x4">Rubik's Professor</option>
            </select>
        </div>

        <Timer></Timer>

        <nav class="navigation">
            <ul>
                <li v-if="user">{{ user.displayName ? user.displayName : user.email }}</li>
                <li v-else @click="$refs.login.open()">Login</li>
                <li @click="$refs.statistics.open()">Show all times</li>
            </ul>
        </nav>

        <aside class="hint">
            <span>
                Press <kbd>Spacebar</kbd> to start the timer
            </span>
        </aside>

        <RecentTimes />

        <sweet-modal ref="statistics">
            <StatisticsModalContent />
        </sweet-modal>

        <sweet-modal ref="login" width="300px">
        </sweet-modal>
    </div>
</template>

<script>
import BackgroundAnimation from '~/components/BackgroundAnimation'
import RecentTimes from '~/components/RecentTimes'
import ModalContent from '~/components/Statistics/ModalContent'
import Timer from '~/components/Timer'
import { types } from '~/store/mutations'

import { SweetModal } from 'sweet-modal-vue'

export default {
    components: {
        BackgroundAnimation, Timer, RecentTimes, SweetModal, StatisticsModalContent: ModalContent
    },

    mounted () {
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
        }
    }
}
</script>
