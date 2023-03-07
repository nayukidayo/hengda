import net from 'node:net'
import { RTU, KA } from './parser.mjs'

const server = net.createServer(c => {
  c.on('error', console.log)
  c.pipe(new RTU(c.remoteAddress)).pipe(new KA()).pipe(c)
})

server.on('error', console.log)
server.listen(51824, '0.0.0.0')
