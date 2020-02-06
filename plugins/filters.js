import Vue from 'vue'

Vue.filter('padded', (value, length = 2, symbol = '0') => {
    return String(value).padStart(length, symbol)
})

Vue.filter('timeDisplay', (value, decimalDigits = 2) => {
    let time = value

    if (!Number.isInteger(value)) {
        time = value.time
        if (value.penalty) time += 2 * Math.pow(10, decimalDigits)
    }

    let accuracy = Math.pow(10, decimalDigits)

    let seconds = Math.floor(time / accuracy)
    let minutes = Math.floor(seconds / 60)

    return String(minutes).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0') + '.' + String(time % accuracy).padStart(decimalDigits, '0')
})
