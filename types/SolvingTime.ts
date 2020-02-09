import { AvailableTimingMethods } from '~/components/TimingMethods'
import shortid from 'shortid'

export interface SolvingTime {
  id: string,
  milliseconds: number,
  decimals?: number,
  dnf?: boolean,
  penalty?: boolean,
  created: Date,
  mode: string,
  timingMethod?: AvailableTimingMethods,
}

export function createSolvingTime (mode: string): SolvingTime {
  return {
    id: shortid.generate(),
    milliseconds: 0,
    dnf: false,
    penalty: false,
    created: new Date(),
    mode: mode,
  }
}
