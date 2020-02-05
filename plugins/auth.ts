import { Plugin } from '@nuxt/types'

const authPlugin: Plugin = ({ app }) => {
    app.$fireAuth.onAuthStateChanged((user) => {
        app.$accessor.user.setUser(user)
    })
}

export default authPlugin
