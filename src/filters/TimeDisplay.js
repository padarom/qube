export default function (value) {
    let seconds = Math.floor(value / 100)
    let minutes = Math.floor(seconds / 60)

    return String(minutes).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0') + '.' + String(value % 100).padStart(2, '0')
}
