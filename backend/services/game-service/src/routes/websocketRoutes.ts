import { FastifyInstance, FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { setupPlayerSocket } from "../controllers/setupPlayerSocket.js";
import { handleAuth } from "../services/wsAuthHandler.js";
import { logger } from "../app.js";


export default async function websocketRoutes(fastify: FastifyInstance) {
  
  fastify.get("/v1/ws/game", { websocket: true }, (socket: WebSocket, req: FastifyRequest) => {
    const token = (req.query as any).jwt;
    const jwtPayload = handleAuth(socket, token);
    
    if (!jwtPayload)
      return;
    setupPlayerSocket(socket, jwtPayload.player_id);
  
  });
}



