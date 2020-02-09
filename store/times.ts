import { getAccessorType, mutationTree, getterTree } from 'typed-vuex'
import SolvingTime from '~/types/SolvingTime'

export const state = () => ({
  list: {} as { [s: string]: SolvingTime },
})

export const getters = getterTree(state, {
  modeTimes (state, getters, rootState) {
    if (!state.list) return []

    return Object.keys(state.list)
      .map(id => state.list[id])
      .filter(time => time.mode == rootState.configuration.mode)
      .sort((a, b) => {
        return a.created < b.created ? 1 : -1
      })
  }
})

export const accessorType = getAccessorType({
  state,
  // mutations,
  getters,
})

export default {
  firestorePath: 'users/{userId}/times',
  firestoreRefType: 'collection',
  moduleName: 'times',
  statePropName: 'list',
  namespaced: true,

  state,
  getters,
  accessorType,
}
