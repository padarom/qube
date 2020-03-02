import { AvailableTimingMethods } from '~/components/TimingMethods'
import shortid from 'shortid'
import firebase from 'firebase'

export default interface SolvingTime {
  id: string,
  milliseconds: number,
  decimals: number,
  dnf?: boolean,
  penalty?: boolean,
  created: firebase.firestore.Timestamp,
  mode: string,
  timingMethod?: AvailableTimingMethods,
  scramble?: string,
}

export function createSolvingTime (mode: string): SolvingTime {
  return {
    id: shortid.generate(),
    milliseconds: 0,
    decimals: 2,
    dnf: false,
    penalty: false,
    created: firebase.firestore.Timestamp.now(),
    mode: mode,
  }
}
