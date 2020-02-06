import TimingMethod from './TimingMethod'

type Bit = boolean

type RunLengthEncoding<T> = {
    data: T,
    length: number,
}[]

class RS232Decoder {

    constructor (protected ticksPerBit: number) { }

    floatSignalToBinary (signal: number): Bit {
        // The signal might be 0, especially if the StackMat is turned off.
        // This isn't much of an issue though as 0 is mapped to false and therefore
        // can't be interpreted as correct data because a start can't be found.
        return signal < 0
    }

    findPacketStart (data: RunLengthEncoding<Bit>): number {
        // Any proper packet can at most consist of 8x bit 1. Therefore the stop signal
        // is at least as long. As soon as we encounter a signal of at least that length,
        // we know that the following bits belong to our packet.
        let minimumHighLength = 9 * this.ticksPerBit

        return data.findIndex(char => char.data === true && char.length >= minimumHighLength)
    }

    runLengthEncode (data: Bit[]): RunLengthEncoding<Bit> {
        let lastBit: Bit = false
        let result = []

        for (let i = 0; i < data.length; i++) {
            if (lastBit != data[i] || i == 0) {
                result.push({ data: data[i], length: 1 })
                lastBit = data[i]
            } else {
                result[result.length - 1].length += 1
            }
        }

        return result
    }

    getBitsFromRunLengthEncodedSignal (data: RunLengthEncoding<Bit>): Bit[] {
        let bits: Bit[] = []

        for (let char of data) {
            let count = Math.round(char.length / this.ticksPerBit)
            bits.push(...Array(count).fill(char.data))
        }
        
        return bits
    }

    decodeBits (data: Bit[], offset: number): number {
        let bitArray = data.slice(offset + 1, offset + 9)
            .map(bit => bit ? 1 : 0)

        // The bits are in little-endian, so we'll have to reverse the array
        // for decoding.
        return parseInt(bitArray.reverse().join(''), 2)
    }

    getPacket (data: Bit[]): number[] {
        return [...Array(10).keys()].map(i => this.decodeBits(data, i * 10))
    }

    decode (analogSignal: Float32Array): number[] | null {
        let digitalSignal = Array.from(analogSignal).map(n => this.floatSignalToBinary(n))

        let runLengthEncoded = this.runLengthEncode(digitalSignal)
        let startIndex = this.findPacketStart(runLengthEncoded)
        if (startIndex == -1) return null

        let bits = this.getBitsFromRunLengthEncodedSignal(runLengthEncoded.slice(startIndex + 1))
        return this.getPacket(bits)
    }
}

type StackMatStatus = {
    status: string,
    digits: string[]
}

export default class StackMatG4 extends TimingMethod {

    protected audioContext: AudioContext
    protected rs232Decoder: RS232Decoder
    protected previousState: StackMatStatus | null = null

    constructor () {
        super()

        this.audioContext = new AudioContext()
        this.rs232Decoder = new RS232Decoder(this.audioContext.sampleRate / 1200)

        this.setupAudioContext()
    }

    async setupAudioContext () {
        let stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
            },
            video: false,
        })

        let source = this.audioContext.createMediaStreamSource(stream)
        let processor = this.audioContext.createScriptProcessor(4096 * 4, 1, 1)
        processor.onaudioprocess = (e) => this.signalFetched(e.inputBuffer.getChannelData(0))

        source.connect(processor)
        processor.connect(this.audioContext.destination)
    }

    decode (packet: number[]): StackMatStatus | null {
        if (!this.isValidPacket(packet)) return null

        return {
            status: String.fromCharCode(packet[0]),
            digits: packet.slice(1, 7).map(ascii => String.fromCharCode(ascii))
        }
    }

    isValidPacket (data: number[]): boolean {
        const contains = (needle: number, haystack: string): boolean => {
            return haystack.indexOf(String.fromCharCode(needle)) != -1
        }

        let checksum = data.slice(1, 7).map(v => v - 48).reduce((t, s) => t + s)

        return contains(data[0], 'IA SLRC')
            && contains(data[1], '0123456789')
            && contains(data[2], '0123456789')
            && contains(data[3], '0123456789')
            && contains(data[4], '0123456789')
            && contains(data[5], '0123456789')
            && contains(data[6], '0123456789')
            && checksum == data[7] - 64
            && data[8] == 10
            && data[9] == 13
    }

    signalFetched (signal: Float32Array) {
        let packet = this.rs232Decoder.decode(signal)
        if (!packet) return

        let state = this.decode(packet)
        if (!state) return

        // Always emit the current time
        let milliseconds = parseInt(state.digits.join(''))
        this.emitter.setTime(milliseconds)

        if (this.previousState) {
            let previousMilliseconds = parseInt(this.previousState.digits.join(''))
            let hasStateChanged = this.previousState.status != state.status || milliseconds != previousMilliseconds

            if (milliseconds == 0 && state.status == 'I') this.emitter.ready()

            if (hasStateChanged) {
                if (this.previousState.status != ' ' && state.status == ' ') this.emitter.start()
                if (this.previousState.status == ' ' && state.status == 'I') this.emitter.stop(milliseconds)
                if (previousMilliseconds > milliseconds) {
                    this.emitter.reset()
                }
            }
        }

        this.previousState = state
    }

}
