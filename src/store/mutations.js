export default {
    switchMode (state, mode) {
        state.mode = mode
    },

    setUser (state, user) {
        state.user = user
    },

    addNewTime (state, record) {
        let times = state.times
        times.splice(0, 0, record)

        state.times = times
    }
}
