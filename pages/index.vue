<template>
    <div id="app">
        <BackgroundAnimation />

        <div class="mode-switch">
            <div class="puzzle">
                <select v-model="mode">
                    <option value="3x3">Rubik's Cube</option>
                    <option value="4x4">Rubik's Professor</option>
                </select>
            </div>

            <!--
            <div class="modes">
                <select v-model="mode">
                    <option value="3x3">Rubik's Cube</option>
                    <option value="4x4">Rubik's Professor</option>
                </select>
            </div>
            -->
        </div>

        <Timer />

        <nav class="navigation">
            <ul>
                <li v-if="user" @click="$modal.show('user')">{{ user.displayName ? user.displayName : user.email }}</li>
                <li v-else @click="$modal.show('user')">Login</li>
                <li @click="$modal.show('statistics')">Show all times</li>
                <li @click="$modal.show('settings')"><i class="fal fa-cogs"></i></li>
            </ul>
        </nav>

        <RecentTimes />

        <StatisticsModal />
        <AppSettingsModal />
        <UserSettingsModal />
        <TimeDetailsModal />
        <DialogModal />
    </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import DialogModal from '~/components/Modals/DialogModal.vue'
import BackgroundAnimation from '~/components/BackgroundAnimation.vue'
import AppSettingsModal from '~/components/Modals/Settings/AppSettings.vue'
import UserSettingsModal from '~/components/Modals/Settings/UserSettings.vue'
import TimeDetailsModal from '~/components/Modals/TimeDetails/TimeDetailsModal.vue'
import StatisticsModal from '~/components/Modals/Statistics/StatisticsModal.vue'
import RecentTimes from '~/components/RecentTimes.vue'
import Timer from '~/components/Timer.vue'

export default Vue.extend({
  components: {
    BackgroundAnimation,
    DialogModal,
    AppSettingsModal,
    UserSettingsModal,
    TimeDetailsModal,
    RecentTimes,
    StatisticsModal,
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
