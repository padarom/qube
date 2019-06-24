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
    },

    updateTime (state, record) {
        state.times = state.times.map((time) => {
            return (time.id !== record.id) ? time : record
        })
    }
}
