import Vue from 'vue'
import { Time } from '~/store/times'

Vue.filter('padded', (value: number, length: number = 2, symbol: string = '0') => {
  return String(value).padStart(length, symbol)
})

Vue.filter('timeDisplay', (value: number | Time) => {
  let time = value as number
  if (typeof value !== 'number') {
    time = value.time
    if (value.penalty) time += 2 * 100
  }

  let seconds = Math.floor(time / 100)
  let minutes = Math.floor(seconds / 60)

  return String(minutes).padStart(2, '0')
    + ':' + String(seconds % 60).padStart(2, '0')
    + '.' + String(time % 100).padStart(2, '0')
})
