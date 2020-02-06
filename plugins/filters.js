import Vue from 'vue'

Vue.filter('padded', (value, length = 2, symbol = '0') => {
    return String(value).padStart(length, symbol)
})

Vue.filter('timeDisplay', (value, accuracy = 1000) => {
    let decimalDigits = String(accuracy).length - 1
    let time = value

    if (!Number.isInteger(value)) {
        time = value.time
        if (value.penalty) time += 2 * 100
    }

    let seconds = Math.floor(time / 100)
    let minutes = Math.floor(seconds / 60)

    return String(minutes).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0') + '.' + String(time % accuracy).padStart(decimalDigits, '0')
})
