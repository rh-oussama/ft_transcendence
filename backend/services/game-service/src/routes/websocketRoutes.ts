import { FastifyInstance, FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "../routes/gameRoutes.js"
import { players } from "../services/handleGameCreation.js";
import { logger } from "../app.js";

interface JWTPayload extends jwt.JwtPayload {
  player_id: string;
}



function authCheck(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, SECRET) as JWTPayload;
    if (!payload.player_id) {
      logger.warn("JWT valid but player_id missing in payload");
      return null;
    }
    if (!players.has(payload.player_id)) {
      logger.warn(`Player '${payload.player_id}' does not exist in players map.`);
      return null;
    }
    return payload;
  } catch {
    logger.warn("JWT is not valid.");
    return null;
  }
}


let websocketConnectionCount = 0;

export default async function websocketRoutes(fastify: FastifyInstance) {
  fastify.get("/ws/game", { websocket: true }, (socket: WebSocket, req: FastifyRequest) => {
    
    
    
    logger.info(`====== Websocket start ${websocketConnectionCount} ======`);

    websocketConnectionCount++;


    const token = (req.query as any).jwt;
    const jwtPayload = authCheck(token);
    logger.info(`JWT payload for player: ${JSON.stringify(jwtPayload)}`);




    if (!jwtPayload) {
      logger.warn("Authentication failed, closing socket.");
      socket.close();
      return;
    }

    const player_id = jwtPayload.player_id;
    const player = players.get(player_id);

    if (player && player.ws === undefined) {
      player.ws = socket;
      logger.info(`WebSocket assigned to player '${player_id}'`);
    } else {
      logger.warn("Player not found or ws already assigned.");
    }

    socket.on("message", (message: Buffer) => {
      try {
        const msgObj = JSON.parse(message.toString());
        logger.info(`Received from player '${player_id}': ${JSON.stringify(msgObj)}`);
      } catch {
        logger.warn(`Received invalid JSON from player '${player_id}': ${message.toString()}`);
      }
    });

    socket.on("close", () => {
      if (player) {
        player.ws = undefined;
        logger.info(`WebSocket removed from player '${player_id}'`);
      }
    });
  });
  logger.info(`====== Websocket end ======`);
}

