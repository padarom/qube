import Vue from 'vue'
import Vuex from 'vuex'
import VuexEasyFirestore from 'vuex-easy-firestore'
import VuexPersistence from 'vuex-persist'
import { Firebase, initFirebase } from './config/firebase'

import times from './times'
import user from './user'
import configuration from './configuration'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
})

const easyFirestore = VuexEasyFirestore(
    [times],
    { logging: true, FirebaseDependency: Firebase }
)

const store = new Vuex.Store({
    modules: {
        user,
        configuration,
    },
    plugins: [easyFirestore, vuexLocal.plugin],
})

initFirebase()
    .catch((error: any) => {
        console.warn(error)
    })

export default () => store
