export interface State {
    user: null | object
}

const state = (): State => ({
    user: null
})

const mutations = {
    setUser (state: State, user: object) {
        state.user = user
    }
}

const actions = {

}

export default {
    state,
    mutations,
    actions,
}
