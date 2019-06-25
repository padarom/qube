import TimingMethod from './TimingMethod'

class RS232Decoder {

    constructor (protected ticksPerBit: number) {
    }

    floatSignalToBinary (signal: number) {
        if (signal > 0) return 0
        if (signal < 0) return 1
        return -2
    }

    findSignalStart (data: Float32Array) {
        let ones = 0
        let waitingForZero = false

        for (let i = 0; i < data.length; i++) {
            let bit = data[i]
            if (bit == 1) ones++
            if (ones > 9 * this.ticksPerBit) waitingForZero = true

            if (bit == 0) {
                ones = 0
                if (waitingForZero) return i
            }
        }

        return undefined
    }

    runLengthEncode (data: Float32Array) {
        let lastBit = -1
        let result = []

        for (let i = 0; i < data.length; i++) {
            if (lastBit != data[i]) {
                result.push({ bit: data[i], length: 1 })
                lastBit = data[i]
            } else {
                result[result.length - 1].length += 1
            }
        }

        return result
    }

    getBitsFromRunLengthEncodedSignal (signal: any) {
        let bits = []
        for (let e of signal) {
            let bitsCount = Math.round(e.length / this.ticksPerBit)
            for (let i = 0; i < bitsCount; i++) {
                bits.push(e.bit)
            }
        }
        
        return bits
    }

    decodeBits (data: any, offset: number) {
        let result = 0
        console.log(data, offset)
        for (let i = 0; i < 8; i++) {
            result += data[offset + i] << i
        }
        return result
    }

    getPacket (data: any) {
        return [...Array(9).keys()].map(i => this.decodeBits(data, i * 10))
    }

    decode (data: Float32Array) {
        let bits: any = Array.from(data).map(n => this.floatSignalToBinary(n))
        let startIndex = this.findSignalStart(bits)
        return console.log(data, startIndex)
        //document.dispatchEvent(new CustomEvent('my_custom_event', { detail: { bits, startIndex }}))
        //return

        // console.log(startIndex)
        let runLengthEncoded = this.runLengthEncode(bits.slice(startIndex))
        console.log(runLengthEncoded)
        bits = this.getBitsFromRunLengthEncodedSignal(runLengthEncoded)
        // console.log(bits)
        return this.getPacket(bits.slice(1))
    }

}

export default class StackMatG4 extends TimingMethod {

    protected audioContext: AudioContext
    protected rs232Decoder: RS232Decoder

    constructor () {
        super()

        this.audioContext = new AudioContext()
        this.rs232Decoder = new RS232Decoder(this.audioContext.sampleRate / 1200)

        this.setupAudioContext()
    }

    async setupAudioContext () {
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

        let source = this.audioContext.createMediaStreamSource(stream)
        let processor = this.audioContext.createScriptProcessor(4096 * 4, 1, 1)

        source.connect(processor)
        source.connect(this.audioContext.destination)
        processor.connect(this.audioContext.destination)

        processor.onaudioprocess = e => this.signalFetched(e.inputBuffer.getChannelData(0))
    }

    decode (packet: number[]) {
        if (!this.isValidPacket(packet)) return null

        return {
            status: packet[0],
            digits: packet.slice(1, 4)
        }
    }

    isValidPacket (data: any): boolean {
        const contains = (needle: number, haystack: string) => {
            return haystack.indexOf(String.fromCharCode(needle)) != -1
        }

        let checksum = data.slice(1, 4).map((v: number) => v - 48).reduce((t: number, s: number) => t + s)

        return contains(data[0], 'IA SLRC')
            && contains(data[1], '0123456789')
            && contains(data[2], '0123456789')
            && contains(data[3], '0123456789')
            && contains(data[4], '0123456789')
            && contains(data[5], '0123456789')
            && checksum == data[6] - 64
            && data[7] == 10
            && data[8] == 13
    }

    signalFetched (signal: Float32Array) {
        let packet = this.rs232Decoder.decode(signal)
        if (!packet) return

        let decodedSignal = this.decode(packet)
        console.log(packet, decodedSignal)
    }

}
