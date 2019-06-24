import { MutationTree } from 'vuex'
import { State, Time } from './state'

export const types = {
    SWITCH_MODE: 'SWITCH_MODE',
    SET_USER: 'SET_USER',
    ADD_TIME: 'ADD_TIME',
    UPDATE_TIME: 'UPDATE_TIME'
}

export default {
    [types.SWITCH_MODE] (state: State, mode) {
        state.mode = mode
    },

    [types.SET_USER] (state: State, user: object) {
        state.user = user
    },

    [types.ADD_TIME] (state: State, record: Time) {
        let times = state.times
        times.splice(0, 0, record)

        state.times = times
    },

    [types.UPDATE_TIME] (state: State, record: Time) {
        state.times = state.times.map((time) => {
            return (time.id !== record.id) ? time : record
        })
    }
} as MutationTree<State>
