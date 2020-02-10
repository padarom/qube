import Vue from 'vue'
import SolvingTime from '~/types/SolvingTime'

export function padded (value: number, length: number = 2, symbol: string = '0') {
  return String(value).padStart(length, symbol)
}

export function timeDisplay (value: number | SolvingTime, decimals: number = 2) {
  let time = value as number

  if (typeof value !== 'number') {
    // Override the decimals if the time object provides their own
    if (value.decimals) decimals = value.decimals

    time = value.milliseconds
    if (value.penalty) time += 2000 // Penalties add 2 seconds to the clock
  }

  let remaining = Math.floor((time % 1000) / Math.pow(10, 3 - decimals))
  let seconds = Math.floor(time / 1000)
  let minutes = Math.floor(seconds / 60)  

  return String(minutes).padStart(2, '0')
    + ':' + String(seconds % 60).padStart(2, '0')
    + '.' + String(remaining).padStart(decimals, '0')
}

Vue.filter('padded', padded)
Vue.filter('timeDisplay', timeDisplay)
