
import { players, logger, rooms } from "../app.js";
import { WebSocket } from "ws";
import { WSMessageSchema } from "../types/schemas.js";


export function setupPlayerSocket(socket: WebSocket, player_id: string) {
  const player = players.get(player_id);

  if (player && player.ws === undefined) {
    player.ws = socket;
    logger.info(`WebSocket assigned to player '${player_id}'`);
  } else {
    logger.warn("Player not found or ws already assigned.");
  }

  socket.on("message", (message: Buffer) => {
    try {
      const msgObj = WSMessageSchema.parse(JSON.parse(message.toString()));
      logger.info(`Received from player '${player_id}': ${JSON.stringify(msgObj)}`);
      
      logger.info("test0011");

      console.log(player?.roomId);
      const room = player?.roomId ? rooms.get(player.roomId) : undefined;
      if (!room) {
        logger.warn(`Room not found for player ${player_id}`);
        return;
      }
      logger.info("test000");

      switch (msgObj.type) {
      case "state":
        break;
      case "chat":
      logger.info("inside chat");
        room.broadcast({
          type: "chat",
            payload: {
                message: msgObj.payload.message,
                from: player_id
            }
        });
        break;
    }


    } catch {
      logger.warn(`Receiveddddd invalid JSON from player '${player_id}': ${message.toString()}`);
    }
  });

  socket.on("close", () => {
    if (player) {
      player.ws = undefined;
      logger.info(`WebSocket removed from player '${player_id}'`);
    }
  });
}