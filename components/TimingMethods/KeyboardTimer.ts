export default class KeyboardTimer {
    onStart = () => {}
    onStop = () => {}
    onReset = () => {}

    started = false
    stopped = false

    constructor () {
        window.addEventListener('keydown', event => this.keydown(event), true)
        window.addEventListener('keyup', event => this.keyup(event), true)
    }

    keydown (event: any) {
        if (event.key !== ' ') return

        if (this.stopped) {
            this.onReset()
            this.stopped = false
        }

        if (this.started) {
            this.onStop()
            this.stopped = true
            this.started = false
        }
    }

    keyup (event: any) {
        if (event.key !== ' ') return
        if (this.stopped) return

        this.onStart()
        this.started = true
    }
}
