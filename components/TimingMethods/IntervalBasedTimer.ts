import TimingMethod from './TimingMethod'
import TimeEmitter from '../TimeEmitter'

export default abstract class IntervalBasedTimer extends TimingMethod {

    protected interval: number | null = null

    attachEmitter (emitter: TimeEmitter) {
        emitter.addEventListener(TimeEmitter.Events.TIMER_STARTED, this.setupInterval.bind(this))
        emitter.addEventListener(TimeEmitter.Events.TIMER_ENDED, this.destroyInterval.bind(this))

        return super.attachEmitter(emitter)
    }

    setupInterval () {
        this.interval = window.setInterval(() => {
            this.emitter.increaseTime(10)
        }, 10)
    }

    destroyInterval () {
        if (!this.interval) return

        window.clearInterval(this.interval)
        this.interval = null
    }

}
