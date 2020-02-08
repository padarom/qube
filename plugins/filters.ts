import Vue from 'vue'
import { Time } from '~/store/times'

Vue.filter('padded', (value: number, length: number = 2, symbol: string = '0') => {
  return String(value).padStart(length, symbol)
})

Vue.filter('timeDisplay', (value: number | Time, decimals: number = 2) => {
  let time = value as number

  let accuracy = Math.pow(10, decimals)

  if (typeof value !== 'number') {
    time = value.time
    if (value.penalty) time += 2 * accuracy
  }

  let seconds = Math.floor(time / accuracy)
  let minutes = Math.floor(seconds / 60)

  return String(minutes).padStart(2, '0')
    + ':' + String(seconds % 60).padStart(2, '0')
    + '.' + String(time % accuracy).padStart(decimals, '0')
})
