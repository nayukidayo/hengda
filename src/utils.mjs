import http from 'node:http'
import { env } from 'node:process'

const opts = {
  host: env.HTTP_HOST,
  port: env.HTTP_PORT,
  path: env.HTTP_PATH,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}

export function request(ip, data) {
  const path = `${opts.path}/${ip.split('.')[3]}`
  const req = http.request({ ...opts, path })
  req.on('error', console.log)
  req.end(JSON.stringify(data))
}

export function round(number, precision = 2) {
  return Math.round(+number + 'e' + precision) / Math.pow(10, precision)
}

export function crc(buf) {
  let odd
  let crc = 0xffff
  for (let i = 0; i < buf.length; i++) {
    crc = crc ^ buf[i]
    for (let j = 0; j < 8; j++) {
      odd = crc & 0x0001
      crc = crc >> 1
      if (odd) {
        crc = crc ^ 0xa001
      }
    }
  }
  return crc
}
