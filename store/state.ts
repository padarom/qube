import { AvailableTimingMethods } from '../components/TimingMethods';

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
    timingMethod: AvailableTimingMethods,
    times: Time[],
    user: object | undefined | null
}

export default (): State =>  ({
    mode: '3x3',
    timingMethod: AvailableTimingMethods.Keyboard,
    times: [],
    user: null
})
