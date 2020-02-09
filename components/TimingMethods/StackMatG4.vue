<script lang="ts">
import TimingMethod from './TimingMethod.vue'
import RS232Decoder from './RS232Decoder'

type StackMatStatus = {
  status: string,
  digits: string[]
}

export default TimingMethod.extend({
  data () {
    const audioContext = new AudioContext()

    return {
      audioContext,
      rs232Decoder: new RS232Decoder(audioContext.sampleRate / 1200),
      previousState: null as StackMatStatus | null,
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

    signalFetched (signal: Float32Array) {
      const packet = this.rs232Decoder.decode(signal)
      if (!packet) return

      const state = this.decode(packet)
      if (!state) return

      // Always emit the current time
      const milliseconds = parseInt(state.digits.join(''))
      // this.emitter.setTime(milliseconds)

      if (this.previousState) {
        const previousMilliseconds = parseInt(this.previousState.digits.join(''))
        const hasStateChanged = this.previousState.status !== state.status || milliseconds !== previousMilliseconds

        // if (milliseconds == 0 && state.status == 'I') this.emitter.ready()

        if (hasStateChanged) {
          // this.emitter.hintUpdated()

          // if (this.previousState.status != ' ' && state.status == ' ') this.emitter.start()
          // if (this.previousState.status == ' ' && state.status == 'I') this.emitter.stop(milliseconds)
          if (previousMilliseconds > milliseconds) {
            // this.emitter.reset()
          }
        }
      }

      this.previousState = state
    },
  }
})
</script>
