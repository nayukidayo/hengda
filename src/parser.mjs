import { Transform } from 'node:stream'
import { Buffer } from 'node:buffer'
import { crc, round, request } from './utils.mjs'

export class RTU extends Transform {
  constructor(ip) {
    super()

    this.ip = ip

    this.opts = {
      delimiter: Buffer.from('0103', 'hex'),
      minLen: 41,
    }

    this.buf = Buffer.alloc(0)
  }

  _transform(chunk, _, cb) {
    this.push(chunk)

    let data = Buffer.concat([this.buf, chunk])

    if (data.length < this.opts.minLen) {
      this.buf = data
      return cb()
    }

    let pos = data.indexOf(this.opts.delimiter)

    if (pos !== -1) {
      const len = pos + this.opts.minLen

      if (data.length < len) {
        this.buf = data.subarray(pos)
        return cb()
      }

      this.action(data.subarray(pos, len))
    }

    this.buf = Buffer.alloc(0)
    cb()
  }

  action(chunk) {
    if (crc(chunk.subarray(0, -2)) !== chunk.readUint16LE(chunk.length - 2)) return
    request(this.ip, {
      voltageL1N: round(chunk.readFloatBE(3)),
      voltageL2N: round(chunk.readFloatBE(7)),
      voltageL3N: round(chunk.readFloatBE(11)),
      currentL1: round(chunk.readFloatBE(27)),
      currentL2: round(chunk.readFloatBE(31)),
      currentL3: round(chunk.readFloatBE(35)),
    })
  }
}

export class KA extends Transform {
  constructor() {
    super()

    // 读取 0x03 地址 19000 数量 18
    this.fc = Buffer.from('01034A3800125212', 'hex')

    this.opts = {
      delimiter: Buffer.from('##\r\n'),
      minLen: 4,
    }

    this.buf = Buffer.alloc(0)
  }

  _transform(chunk, _, cb) {
    let data = Buffer.concat([this.buf, chunk])

    if (data.length < this.opts.minLen) {
      this.buf = data
      return cb()
    }

    if (data.includes(this.opts.delimiter)) {
      this.push(this.fc)
    }

    this.buf = Buffer.alloc(0)
    cb()
  }
}
