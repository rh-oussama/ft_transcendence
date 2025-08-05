import { FastifyInstance, FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "../routes/gameRoutes.js"
import { players } from "../services/handleGameCreation.js";
import { logger } from "../app.js";

interface JWTPayload extends jwt.JwtPayload {
  player_id: string;
}


function authCheck(token: string): string | null {
  try {
    const payload = jwt.verify(token, SECRET) as JWTPayload;
    console.log(`payload received: ${JSON.stringify(payload)}`);
    if (!payload.player_id) {
      console.log("JWT valid but player_id missing in payload");
      return null;
    }
    if (!players.has(payload.player_id)) {
      console.log(`Player '${payload.player_id}' does not exist in players map.`);
      return null;
    }
    return payload.player_id;
  } catch {
    console.log("JWT is not valid.");
    return null;
  }
}


export default async function websocketRoutes(fastify: FastifyInstance) {
  fastify.get("/ws/game", { websocket: true }, (socket: WebSocket, req: FastifyRequest) => {
    

    logger.info("WebSocket connection attempt");

    const token = (req.query as any).jwt;
    logger.info(`JWT from query: ${token}`);

    const player_id = authCheck(token);
    logger.info(`authCheck result: ${player_id}`);

    if (!player_id) {
      logger.warn("Authentication failed, closing socket.");
      socket.close();
      return;
    }

    const player = players.get(player_id);
    logger.info(`Player from map: ${JSON.stringify(player)}`);

    if (player && player.ws === undefined) {
      player.ws = socket;
      logger.info(`WebSocket assigned to player '${player_id}'`);
    } else {
      logger.warn("Player not found or ws already assigned.");
    }

    socket.on("message", (message: Buffer) => {
      const messageStr = message.toString();
      logger.info(`Received: ${messageStr}`);
      socket.send("{test: hello}");
    });

    socket.on("close", () => {
      logger.info("Client disconnected");
      if (player) {
        player.ws = undefined;
        logger.info(`WebSocket removed from player '${player_id}'`);
      }
    });



  });
}
