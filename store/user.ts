import { getAccessorType, mutationTree } from 'typed-vuex'
import * as firebase from 'firebase'

export const state = () => ({
  user: undefined as firebase.UserInfo | undefined,
})

export type RootState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setUser (state, user: firebase.User | null) {
    // We need to serialize the user object, otherwise its own logic will keep
    // updating itself, which triggers errors about invalid state mutations.

    state.user = user?.toJSON() as firebase.UserInfo | undefined
  }
})

export const accessorType = getAccessorType({
  state,
  mutations,
})
