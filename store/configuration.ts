import { AvailableTimingMethods } from '~/components/TimingMethods'

export interface State {
    mode: string,
    timingMethod: AvailableTimingMethods,
}

const state = (): State => ({
    mode: '3x3',
    timingMethod: AvailableTimingMethods.Keyboard,
})

const mutations = {
    switchMode (state: State, mode: string) {
        state.mode = mode
    },

    setTimingMethod (state: State, timingMethod: AvailableTimingMethods) {
        state.timingMethod = timingMethod
    },
}

const actions = {

}

export default {
    state,
    mutations,
    actions,
}
