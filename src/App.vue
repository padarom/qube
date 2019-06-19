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
                <li>Show all times</li>
            </ul>
        </nav>

        <aside class="hint">
            <span>
                Press <kbd>Spacebar</kbd> to start the timer
            </span>
        </aside>

        <Statistics />

        <sweet-modal ref="login" width="300px">
            <div id="auth-container"></div>
        </sweet-modal>
    </div>
</template>

<script>
import BackgroundAnimation from '&/BackgroundAnimation'
import { SweetModal } from 'sweet-modal-vue'
import Statistics from '&/Statistics'
import Timer from '&/Timer'
import firebase from 'firebase'
import firebaseui from 'firebaseui'
require('@firebase/firestore')

export default {
    name: 'App',

    components: {
        BackgroundAnimation, Timer, Statistics, SweetModal
    },

    mounted () {
        /*
            const uid = result.user.uid
            const db = firebase.firestore()

            db.collection(uid).add({
                date: Date.now(),
                speed: 146
            })
        */

        firebase.auth().onAuthStateChanged(user => this.$store.commit('setUser', user))
        this.setupFirebaseUI()
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
    },

    methods: {
        setupFirebaseUI () {
            const ui = new firebaseui.auth.AuthUI(firebase.auth())

            ui.start('#auth-container', {
                signInOptions: [
                    {
                        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        scopes: ['email']
                    },
                    {
                        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                        scopes: ['email']
                    },
                    {
                        provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
                        scopes: ['user:email']
                    },
                    {
                        provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID
                    }
                ]
            })
        }
    }
}
</script>

<style lang="scss">
    @import './scss/app';
</style>
