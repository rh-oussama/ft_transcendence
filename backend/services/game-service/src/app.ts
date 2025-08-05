import Fastify, { FastifyRequest } from 'fastify'
import websocket from '@fastify/websocket'
import gameRoutes from './routes/gameRoutes.js'
import websocketRoutes from './routes/websocketRoutes.js'


const fastify = Fastify({
  logger: {
    level: 'trace',
    // transport: { 
    //   target: 'pino-pretty' 
    // }
  }
})

export const logger = fastify.log;




await fastify.register(websocket)
await fastify.register(gameRoutes)
await fastify.register(websocketRoutes)


const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    logger.info('Server listening on port 3000')
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()