<template>
  <div id="user-settings">
    Log in using any of these services. You can link accounts together after logging in.
    <ul>
      <li v-for="(faIcon, key) in providers" :key="key">
        <div class="social-login" @click.prevent="login(key)" :class="{ [key]: true, linked: isLinked(key) }">
          <i class="fab" :class="`fa-${faIcon}`"></i>

          <a href="#" class="unlink" v-if="isLinked(key)" @click.prevent.stop="unlink(key)">
            Unlink
          </a>
        </div>
      </li>
    </ul>
    <a href="#" @click.prevent="logout" v-if="user">Logout</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase'
import mobile from 'is-mobile'

const AuthProviders = {
  google: new firebase.auth.GoogleAuthProvider(),
  github: new firebase.auth.GithubAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
  facebook: new firebase.auth.FacebookAuthProvider(),
}

export default Vue.extend({
  data () {
    return {
      providers: {
        github: 'github',
        twitter: 'twitter',
        google: 'google',
        facebook: 'facebook-f',
      } as Record<keyof typeof AuthProviders, string>
    }
  },

  computed: {
    user () {
      return this.$accessor.user.user
    },
  },

  methods: {
    isLinked (method: keyof typeof AuthProviders): boolean {
      if (!this.user) return false
      const user = this.$fireAuth.currentUser as firebase.User

      return user.providerData.some(info => {
        if (!info) return false

        return info.providerId === AuthProviders[method].providerId
      })
    },

    async login (method: keyof typeof AuthProviders) {
      if (this.user) return this.link(method)

      const provider = AuthProviders[method]
      try {
        const response = await (mobile() ? this.$fireAuth.signInWithRedirect(provider) : this.$fireAuth.signInWithPopup(provider))
      } catch (e) {
        console.error(e)
      }

      this.$forceUpdate()
    },

    async link (method: keyof typeof AuthProviders) {
      if (this.isLinked(method)) return

      const user = this.$fireAuth.currentUser
      if (!user) return

      const provider = AuthProviders[method]
      try {
        const response = await (mobile() ? user.linkWithRedirect(provider) : user.linkWithPopup(provider))
      } catch (e) {
        console.error(e)
      }

      this.$forceUpdate()
    },

    async unlink (method: keyof typeof AuthProviders) {
      const user = this.$fireAuth.currentUser
      if (!user) return

      await user.unlink(AuthProviders[method].providerId)
      this.$forceUpdate()
    },

    async logout () {
      await this.$fireAuth.signOut()
    },
  },
})
</script>

<style scoped lang="stylus">
#user-settings
  font-size: 14px
  line-height: 1.3

ul
  list-style: none
  padding: 0
  margin-top: 30px

  .social-login
    margin-bottom: 10px
    padding: 10px 10px 8px
    color: white
    font-size: 17px
    border-radius: 3px
    position: relative
    cursor: pointer

    .unlink
      position: absolute
      top: 9px
      right: 10px
      font-size: 14px
      color: white
      text-decoration: none
      padding: 2px 5px

.twitter
  background: $brand-twitter

.google
  background: $brand-google

.github
  background: $brand-github

.facebook
  background: $brand-facebook
  padding-left: 12px
</style>
