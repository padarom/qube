import VuexEasyFirestore from 'vuex-easy-firestore'
import { getAccessorType } from 'typed-vuex'
import Vuex from 'vuex'
import Vue from 'vue'

import * as configuration from './configuration'
import * as times from './times'
import * as user from './user'

Vue.use(Vuex)

// We're exporting the accessorType to gain
// TypeScript support for our Vuex store.
export const accessorType = getAccessorType({
  modules: {
    configuration,
    times,
    user,
  },
})

// EasyFirestore allows us to automagically synchronize
// times between Firebase and the local client.
const easyFirestore = VuexEasyFirestore(
  [times.default],
  { logging: true },
)

const store = new Vuex.Store({
  plugins: [easyFirestore],
  modules: {
    // Modules that are included in EasyFirestore cannot be
    // added to the main modules.
    configuration,
    user,
    times,
  },
})

export default () => store
