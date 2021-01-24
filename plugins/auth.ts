import { Plugin } from '@nuxt/types'

const authPlugin: Plugin = ({ app, store }) => {
  app.$fire.auth.onAuthStateChanged((user) => {
    app.$accessor.user.setUser(user)

    if (user) {
      // We need to dispatch this action once, so that VuexEasyFirestore
      // is able to fetch our stored times.
      store.dispatch('times/openDBChannel')
    }
  })
}

export default authPlugin
