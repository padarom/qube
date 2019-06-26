<template>
    <div id="app">
        <BackgroundAnimation />

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
import BackgroundAnimation from '~/components/BackgroundAnimation'
import AppSettings from '~/components/AppSettings'
import RecentTimes from '~/components/RecentTimes'
import ModalContent from '~/components/Statistics/ModalContent'
import Timer from '~/components/Timer'
import { types } from '~/store/mutations'

import { SweetModal } from 'sweet-modal-vue'

export default {
    components: {
        BackgroundAnimation, AppSettings, Timer, RecentTimes, SweetModal, StatisticsModalContent: ModalContent
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

<style lang="stylus">
    .navigation li
        cursor: pointer
</style>
