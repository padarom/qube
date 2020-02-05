import { getAccessorType, mutationTree } from 'typed-vuex'
import { AvailableTimingMethods } from '~/components/TimingMethods'

export const state = () => ({
  mode: '3x3',
  timingMethod: AvailableTimingMethods.Keyboard,
})

export type RootState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  switchMode (state, mode: string) {
    state.mode = mode
  },

  setTimingMethod (state, timingMethod: AvailableTimingMethods) {
    state.timingMethod = timingMethod
  }
})

export const accessorType = getAccessorType({
  state,
  mutations,
})
