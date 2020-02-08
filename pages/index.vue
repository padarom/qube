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

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import BackgroundAnimation from '~/components/BackgroundAnimation.vue'
import AppSettings from '~/components/AppSettings.vue'
import UserSettings from '~/components/UserSettings.vue'
import RecentTimes from '~/components/RecentTimes.vue'
import Timer from '~/components/Timer.vue'

// @ts-ignore
import { SweetModal } from 'sweet-modal-vue'

export default Vue.extend({
  components: {
    BackgroundAnimation,
    AppSettings,
    UserSettings,
    RecentTimes,
    SweetModal: SweetModal as VueConstructor<Vue>,
    Timer,
  },

  computed: {
    mode: {
      get () {
        return this.$accessor.configuration.mode
      },

      set (value: string) {
        this.$accessor.configuration.switchMode(value)
      }
    },

    user () {
      return this.$accessor.user.user
    },
  },
})
</script>

<style lang="stylus">
  .navigation li
    cursor: pointer
</style>
