import TimeEmitter from '../TimeEmitter'

export default abstract class TimingMethod {

    protected emitter: TimeEmitter = new TimeEmitter()

    attachEmitter (emitter: TimeEmitter): TimingMethod {
        this.emitter = emitter
        return this
    }

    teardown () {

    }

    hint () {
        return ''
    }

}
