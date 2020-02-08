export default class TimeEmitter extends EventTarget {
  public static Events = {
    TIME_UPDATED: 'TIME_UPDATED',
    TIMER_STARTED: 'TIMER_STARTED',
    TIMER_ENDED: 'TIMER_ENDED',
    TIMER_RESET: 'TIMER_RESET',
    TIMER_READY: 'TIMER_READY'
  }

  private _time: number = 0
  private _started: boolean = false
  private _ready: boolean = false

  get time(): number {
    return this._time
  }

  get isRunning(): boolean {
    return this._started
  }

  get isReady(): boolean {
    return this._ready
  }

  set time(value: number) {
    this._time = value
    this.dispatchEvent(new CustomEvent(TimeEmitter.Events.TIME_UPDATED, { detail: value }))
  }

  increaseTime (by: number) {
    this.time += by
  }

  setTime (to: number) {
    this.time = to
  }

  start () {
    if (!this._started) {
      this.dispatchEvent(new CustomEvent(TimeEmitter.Events.TIMER_STARTED))
    }

    this._started = true
  }

  stop (value: number | undefined = undefined) {
    if (value) this._time = value
    
    if (this._started) {
      this.dispatchEvent(new CustomEvent(TimeEmitter.Events.TIMER_ENDED, { detail: this._time }))
    }

    this._started = false
    this._ready = false
  }

  ready () {
    if (!this._ready) {
      this.dispatchEvent(new CustomEvent(TimeEmitter.Events.TIMER_READY))
    }

    this._ready = true
  }

  reset () {
    this._started = false
    this._ready = false
    this.time = 0

    this.dispatchEvent(new CustomEvent(TimeEmitter.Events.TIMER_RESET))
  }
}
