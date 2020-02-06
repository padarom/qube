<template>
    <div id="app">
        <BackgroundAnimation />

        <div class="">
            <select v-model="mode">
                <option value="3x3">Rubik's Cube</option>
                <option value="4x4">Rubik's Professor</option>
            </select>
        </div>

        <Timer />

        <nav class="navigation">
            <ul>
                <li v-if="user" @click="$refs.usersettings.open()">{{ user.displayName ? user.displayName : user.email }}</li>
                <li v-else @click="$refs.login.open()">Login</li>
                <li @click="$refs.statistics.open()">Show all times</li>
                <li @click="$refs.settings.open()"><i class="fal fa-cogs"></i></li>
            </ul>
        </nav>

        <RecentTimes />

        <sweet-modal ref="statistics" width="1000px">
            <StatisticsModalContent />
        </sweet-modal>

        <sweet-modal ref="settings">
            <AppSettings />
        </sweet-modal>

        <sweet-modal ref="login" width="300px">
            <div id="auth-container"></div>
        </sweet-modal>

        <sweet-modal v-if="user" ref="usersettings" width="300px">
            <UserSettings />
        </sweet-modal>
    </div>
</template>

<script>
import BackgroundAnimation from '~/components/BackgroundAnimation'
import AppSettings from '~/components/AppSettings'
import UserSettings from '~/components/UserSettings'
import RecentTimes from '~/components/RecentTimes'
import ModalContent from '~/components/Statistics/ModalContent'
import Timer from '~/components/Timer'

import { SweetModal } from 'sweet-modal-vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
require('firebase/firestore') // Firestore comes with side-effects, so we're using require

export default {
    components: {
        BackgroundAnimation,
        AppSettings,
        UserSettings,
        Timer,
        RecentTimes,
        SweetModal,
        StatisticsModalContent: ModalContent,
    },

    data () {
        return {
            audio: {},
            log: false
        }
    },

    mounted () {
        firebase.auth().onAuthStateChanged(user => {
            this.$store.commit('setUser', user)
            if (user) {
                this.$store.dispatch('times/openDBChannel', { orderBy: ['created_at', 'desc'] })
                    .catch(console.error)
            }
        })

        this.setupFirebaseUI()
    },

    computed: {
        mode: {
            get () {
                return this.$store.state.configuration.mode
            },
            set (value) {
                this.$store.commit('switchMode', value)
            }
        },

        user () {
            return this.$store.state.user.user
        }
    },

    methods: {
        setupFirebaseUI () {
            const ui = new firebaseui.auth.AuthUI(firebase.auth())

            ui.start('#auth-container', {
                signInOptions: [
                    { provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID, scopes: ['email'] },
                    { provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID, scopes: ['email'] },
                    { provider: firebase.auth.GithubAuthProvider.PROVIDER_ID, scopes: ['user:email'] },
                    { provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID },
                ]
            })
        }
    }
}
</script>

<style lang="stylus">
    .navigation li
        cursor: pointer
</style>
