import Accelerometer from './Accelerometer.vue'
import StackMatG4 from './StackMatG4.vue'
import Keyboard from './Keyboard.vue'
import Touch from './Touch.vue'
import TimingMethod from './TimingMethod.vue'

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
