import SolvingTime from '~/types/SolvingTime'

export function getAverageOf (n: number, times: SolvingTime[]) {
  return times.reduce((acc, time) => {
    // Push the current time into the list
    acc.times.push(time)

    // Remove previous entries bigger than 5
    if (acc.times.length > n) acc.times.shift()

    if (acc.times.length === n) {
      let total = acc.times.reduce((acc, cur) => acc + cur.milliseconds, 0)
      let average = Math.round(total / n)

      acc.averages.push({ ...time, milliseconds: average })
    }

    return acc
  }, {
    times: [] as SolvingTime[],
    averages: [] as SolvingTime[]
  }).averages
}
