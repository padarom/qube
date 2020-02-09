type Bit = boolean

type RunLengthEncoding<T> = {
  data: T,
  length: number,
}[]

export default class RS232Decoder {
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
