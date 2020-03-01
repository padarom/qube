<template>
  <div>
    <div v-if="value.state === AvailableStates.WAITING">
      Waiting for a connection to your StackMat ...
    </div>
  </div>
</template>

<script lang="ts">
import IntervalBasedTimer from './IntervalBasedTimer.vue'
import RS232Decoder from './RS232Decoder'
import TimingState, { State } from '~/types/TimingState'

type StackMatStatus = {
  status: string,
  digits: string[]
}

export default IntervalBasedTimer.extend({
  data () {
    const audioContext = new AudioContext()

    return {
      audioContext,
      rs232Decoder: new RS232Decoder(audioContext.sampleRate / 1200),
      previousState: null as StackMatStatus | null,
      AvailableStates: State,
      unsuccessfulFetches: 0,
    }
  },

  created () {
    this.setupAudioContext()
  },

  methods: {
    async setupAudioContext () {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
        },
        video: false,
      })

      const source = this.audioContext.createMediaStreamSource(stream)
      const processor = this.audioContext.createScriptProcessor(4096 * 4, 1, 1)
      processor.onaudioprocess = (e) => this.signalFetched(e.inputBuffer.getChannelData(0))

      source.connect(processor)
      processor.connect(this.audioContext.destination)
    },

    decode (packet: number[]): StackMatStatus | null {
      if (!this.isValidPacket(packet)) return null

      return {
        status: String.fromCharCode(packet[0]),
        digits: packet.slice(1, 7).map(ascii => String.fromCharCode(ascii))
      }
    },

    isValidPacket (data: number[]): boolean {
      const contains = (needle: number, haystack: string): boolean => {
        return haystack.indexOf(String.fromCharCode(needle)) !== -1
      }

      const checksum = data.slice(1, 7).map(v => v - 48).reduce((t, s) => t + s)

      return contains(data[0], 'IA SLRC') &&
        contains(data[1], '0123456789') &&
        contains(data[2], '0123456789') &&
        contains(data[3], '0123456789') &&
        contains(data[4], '0123456789') &&
        contains(data[5], '0123456789') &&
        contains(data[6], '0123456789') &&
        checksum === data[7] - 64 &&
        data[8] === 10 &&
        data[9] === 13
    },

    invalidSignal () {
      this.unsuccessfulFetches++
      if (this.unsuccessfulFetches > 4) {
        this.updateState({ state: State.WAITING })
      }
    },

    signalFetched (signal: Float32Array) {
      const packet = this.rs232Decoder.decode(signal)
      if (!packet) return this.invalidSignal()

      const state = this.decode(packet)
      if (!state) return this.invalidSignal()

      this.unsuccessfulFetches = 0
      if (this.value.state === State.WAITING) {
        this.updateState({ state: State.READY })
      }

      // Always emit the current time
      const milliseconds = parseInt(state.digits.join(''))
      this.updateState({ time: { milliseconds, decimals: 3 } })

      if (this.previousState) {
        const previousMilliseconds = parseInt(this.previousState.digits.join(''))
        const hasStateChanged = this.previousState.status !== state.status || milliseconds !== previousMilliseconds

        if (milliseconds === 0 && state.status === 'I') this.updateState({ state: State.READY })

        if (hasStateChanged) {
          if (this.previousState.status !== ' ' && state.status === ' ' && this.value.state !== State.RUNNING) {
            this.startTimer()
            this.updateState({ state: State.RUNNING })
          }

          if (this.previousState.status === ' ' && state.status === 'I') {
            // We need to take care of the case where a user resets the timer as it's running, as that
            // shouldn't count as a 0 second solve.
            if (!state.digits.some(digit => digit !== '0')) {
              this.stopTimer()
              return this.updateState({ state: State.READY })
            }

            this.stopTimer()
            this.updateState({ state: State.FINISHED })
          }

          if (previousMilliseconds > milliseconds) {
            this.updateState({ state: State.READY })
          }
        }
      }

      this.previousState = state
    },
  }
})
</script>
