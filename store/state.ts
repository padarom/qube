export interface Time {
    id: string,
    time: number,
    dnf?: boolean,
    penalty?: boolean,
    timestamp: Date,
    timingMethod?: string
}

export interface State {
    mode: string,
    timingMethod: string,
    times: Time[],
    user: object | undefined | null
}

export default (): State =>  ({
    mode: '3x3',
    timingMethod: 'keyboard',
    times: [
        { time: 1, id: 'abc-def', dnf: true, timestamp: new Date() },
        { time: 100, id: 'abc-deg', timestamp: new Date() },
        { time: 10090, id: 'abc-deh', timestamp: new Date() },
        { time: 15020, id: 'abc-dei', timestamp: new Date() },
        { time: 170030, id: 'abc-dej', timestamp: new Date() }
    ],
    user: null
})
