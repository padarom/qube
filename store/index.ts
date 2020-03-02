import VuexEasyFirestore from 'vuex-easy-firestore'
import VuexPersistence from 'vuex-persist'
import { getAccessorType } from 'typed-vuex'
import Vuex from 'vuex'

import * as configuration from './configuration'
import * as user from './user'
import * as times from './times'

// We're exporting the accessorType to gain
// TypeScript support for our Vuex store.
export const accessorType = getAccessorType({
  modules: {
    configuration,
    user,
  },
})

// We need to export our firestore accessorType separately
// because there's currently no way to dynamically append modules
// to the global $accessor instance.
export const firestoreAccessorType = getAccessorType({
  modules: { times },
})

const easyFirestorePlugin = VuexEasyFirestore(
  [times.default],
  { logging: true },
)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['configuration'],
})

const store = new Vuex.Store({
  modules: {
    // Modules that are included in EasyFirestore cannot be
    // added to the main modules.
    configuration,
    user,
  },
  plugins: [
    easyFirestorePlugin,
    vuexLocal.plugin,
  ],
})

export default () => store
