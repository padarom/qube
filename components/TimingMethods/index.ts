import Accelerometer from './Accelerometer.vue'
import StackMatG4 from './StackMatG4.vue'
import Keyboard from './Keyboard.vue'
import Touch from './Touch.vue'
import TimingMethod from './TimingMethod.vue'
import ManualInput from './ManualInput.vue'

export enum AvailableTimingMethods {
  Accelerometer = 'accelerometer',
  Stackmat = 'stackmat',
  Keyboard = 'keyboard',
  Touch = 'touch',
  ManualInput = 'manualinnput'
}

// @TODO: Figure out the typing issues.
// @ts-ignore
export default {
  [AvailableTimingMethods.Accelerometer]: Accelerometer,
  [AvailableTimingMethods.Stackmat]: StackMatG4,
  [AvailableTimingMethods.Keyboard]: Keyboard,
  [AvailableTimingMethods.Touch]: Touch,
  [AvailableTimingMethods.ManualInput]: ManualInput,
} as { [key in AvailableTimingMethods]: typeof TimingMethod }
