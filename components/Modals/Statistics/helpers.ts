import SolvingTime from '~/types/SolvingTime'

export function timeInMilliseconds (time: SolvingTime) {
  return time.milliseconds + (time.penalty ? 2000 : 0)
}

export function getAverageOf (n: number, times: SolvingTime[]) {
  return times.reduce((acc, time) => {
    // Push the current time into the list
    acc.times.push(time)

    // Remove previous entries bigger than 5
    if (acc.times.length > n && n > 0) acc.times.shift()

    if (acc.times.length === n || n === 0) {
      let total = acc.times.reduce((acc, cur) => acc + cur.milliseconds, 0)
      let average = Math.round(total / acc.times.length)

      if (n === 0) {
        console.log(acc.times.length, total)
      }

      acc.averages.push({ ...time, milliseconds: average })
    }

    return acc
  }, {
    times: [] as SolvingTime[],
    averages: [] as SolvingTime[]
  }).averages
}
