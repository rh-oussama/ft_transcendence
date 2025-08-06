
import { players, logger } from "../app.js";
import { WebSocket } from "ws";


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
}