export interface Time {
    id: string,
    time: number,
    dnf?: boolean,
    penalty?: boolean,
    timestamp: Date,
    mode: string,
    timingMethod?: string
}

export interface State {
    list: { [s: string]: Time }
}

const state = (): State => ({
    list: {},
})

const getters = {
    modeTimes (state: State, getters: any, rootState: any) {
        if (!state.list) return []

        return Object.keys(state.list)
            .map(id => state.list[id])
            .filter(time => time.mode == rootState.configuration.mode)
            .sort((a: Time, b: Time) => {
                return a.timestamp < b.timestamp ? 1 : -1
            })
    }
}

export default {
    firestorePath: 'users/{userId}/times',
    firestoreRefType: 'collection',
    moduleName: 'times',
    statePropName: 'list',
    namespaced: true,

    state,
    getters,
}
