import { getAccessorType, mutationTree, getterTree } from 'typed-vuex'
import { AvailableTimingMethods } from '~/components/TimingMethods'

export interface Time {
  id: string,
  time: number,
  dnf?: boolean,
  penalty?: boolean,
  timestamp: Date,
  mode: string,
  timingMethod?: AvailableTimingMethods
}

export const state = () => ({
  list: {} as { [s: string]: Time },
})

export const getters = getterTree(state, {
  modeTimes (state, getters, rootState) {
    if (!state.list) return []

    return Object.keys(state.list)
      .map(id => state.list[id])
      .filter(time => time.mode == rootState.configuration.mode)
      .sort((a, b) => {
        return a.timestamp < b.timestamp ? 1 : -1
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
