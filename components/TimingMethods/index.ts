import Accelerometer from './Accelerometer'
import StackMatG4 from './StackMatG4'
import Keyboard from './Keyboard'
import Touch from './Touch'
import TimingMethod from './TimingMethod'

export enum AvailableTimingMethods {
  Accelerometer = 'accelerometer',
  Stackmat = 'stackmat',
  Keyboard = 'keyboard',
  Touch = 'touch'
}

export default {
  [AvailableTimingMethods.Accelerometer]: Accelerometer,
  [AvailableTimingMethods.Stackmat]: StackMatG4,
  [AvailableTimingMethods.Keyboard]: Keyboard,
  [AvailableTimingMethods.Touch]: Touch
} as { [key in AvailableTimingMethods]: typeof TimingMethod }
