import { logger, players} from "../app.js";
import { SECRET } from "../routes/gameRoutes.js";
import { JWTPayload, WSMessages } from "../types/schemas.js";

import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";


export function authCheck(token: string): JWTPayload | null {
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



export function handleAuth(socket: WebSocket, token: string): JWTPayload | null {
  const jwtPayload = authCheck(token);
  logger.info(`JWT payload for player: ${JSON.stringify(jwtPayload)}`);

  if (!jwtPayload) {
    logger.warn("Authentication failed, closing socket.");
    const wsMsg: WSMessages["Auth"] = {
      type: "auth",
      payload: {
        status: "fail"
      }
    };
    
    socket.send(JSON.stringify(wsMsg), () => {
      socket.close(1008, "Authentication failed");
    });
    return null;
  }

  // Send success auth message
  const successMsg: WSMessages["Auth"] = {
    type: "auth",
    payload: {
      status: "success"
    }
  };
  socket.send(JSON.stringify(successMsg));
  
  return jwtPayload;
}