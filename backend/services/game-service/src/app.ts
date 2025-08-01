import Fastify, { FastifyRequest } from 'fastify'
import websocket from '@fastify/websocket'
import gameRoutes from './routes/gameRoutes.js'
import websocketRoutes from './routes/websocketRoutes.js'


const fastify = Fastify({
  logger: true
})

await fastify.register(websocket)
await fastify.register(gameRoutes)
await fastify.register(websocketRoutes)


const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server listening on port 3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
console.log("hello world");