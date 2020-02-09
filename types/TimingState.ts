import SolvingTime, { createSolvingTime } from './SolvingTime'

export enum State {
  WAITING,
  READY,
  RUNNING,
  FINISHED,
}

export default interface TimingState {
  time: SolvingTime,
  state: State,
}

export function createTimingState (mode: string) {
  return {
    time: createSolvingTime(mode),
    state: State.WAITING,
  }
}
