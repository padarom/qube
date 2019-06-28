<template>
    <div id="statistics-modal">
        <TimeChart :chartData="chartData" :width="1200" :style="{ width: 1200 }" />

        <aside class="statistics" v-show="false">
            <ul>
                <li v-for="time in times" :key="time.id">
                    <RecordedTime :time="time" />
                </li>
            </ul>
        </aside>
    </div>
</template>

<script>
import RecordedTime from '../RecordedTime'
import TimeChart from './TimeChart'

export default {
    components: {
        RecordedTime, TimeChart
    },

    methods: {
        getAverages (times, n) {
            return times.reduce((acc, time) => {
                // Push the current time into the list
                acc.times.push(time)
                // Remove previous entries bigger than 5
                if (acc.times.length > n) acc.times.shift()

                if (acc.times.length === n) {
                    let total = acc.times.reduce((acc, cur) => acc + cur.time, 0)
                    let average = Math.round(total / n)

                    acc.averages.push({ ...time, time: average })
                }

                return acc
            }, { times: [], averages: [] }).averages
        }
    },

    computed: {
        times () {
            let times = this.$store.state.times.slice()
            times.sort((a, b) => new Date(a.timestamp) <= new Date(b.timestamp) ? -1 : 1)

            return times
        },

        chartData () {
            let labels = this.times.map(time => time.timestamp)

            let generateAverage = (n, label, color) => ({
                label,
                tension: 0.3,
                fill: false,
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: color,
                pointRadius: 5,
                pointBorderColor: 'transparent',
                data: this.getAverages(this.times, n)
                    .map(time => ({
                        ...time,
                        x: labels.indexOf(time.timestamp),
                        y: time.time
                    }))
            })

            return {
                labels: [...labels.keys()],
                datasets: [
                    {
                        label: 'Individual times',
                        tension: 0,
                        fill: false,
                        backgroundColor: 'transparent',
                        borderColor: 'hsla(0, 90%, 60%, 0.7)',
                        borderWidth: 2,
                        showLine: false,
                        data: this.times.map(time => ({ ...time, y: time.time }))
                    },
                    generateAverage(5, 'Average of 5', 'hsl(215, 60%, 50%)'),
                    generateAverage(12, 'Average of 12', 'hsl(90, 60%, 40%)')
                ]
            }
        }
    }
}
</script>
