import TimingMethod from './TimingMethod'

class RS232Decoder {

    constructor (protected ticksPerBit: number) {
    }

    floatSignalToBinary (signal: number): number {
        if (signal > 0) return 0
        if (signal < 0) return 1
        return -2
    }

    findSignalStart (data: number[]) {
        let ones = 0
        let waitingForZero = false

        for (let i = 0; i < data.length; i++) {
            let bit = data[i]
            if (bit == 0) ones++
            if (ones > 9 * this.ticksPerBit) waitingForZero = true

            if (bit == 1) {
                ones = 0
                if (waitingForZero) return i
            }
        }
        return undefined
    }

    runLengthEncode (data: number[]) {
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

    decodeBits (data: number[], offset: number) {
        let bitArray = data.slice(offset + 1, offset + 8)
        return bitArray.reduce((acc, bit) => (acc << 1) | bit, 0)
    }

    getPacket (data: any) {
        return [...Array(10).keys()].map(i => this.decodeBits(data, i * 10))
    }

    decode (data: Float32Array) {
        let bits = Array.from(data).map(n => this.floatSignalToBinary(n))
        let startIndex = this.findSignalStart(bits)

        let runLengthEncoded = this.runLengthEncode(bits.slice(startIndex))
        document.dispatchEvent(new CustomEvent('my_custom_event', { detail: { signal: Array.from(data), bits, startIndex }}))
        
        bits = this.getBitsFromRunLengthEncodedSignal(runLengthEncoded)
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
        let stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false }, video: false })

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
        //console.log(packet, decodedSignal)
        // @ts-ignore
        console.log(packet, packet.map(s => String.fromCharCode(s)))
    }

}
