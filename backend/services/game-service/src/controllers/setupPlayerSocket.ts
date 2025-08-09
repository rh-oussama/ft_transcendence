
import { players, logger, rooms } from "../app.js";
import { WebSocket } from "ws";
import { ClientWSMessageSchema } from "../types/clientSchemasWs.js";


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
      const msg = ClientWSMessageSchema.parse(JSON.parse(message.toString()));
      logger.info(`Received from player '${player_id}': ${JSON.stringify(msg)}`);
      
      console.log(player?.roomInstance?.id);

      switch (msg.type) {

        // handle auth ()
        case "client_auth":
          break;

  
        // handle chat 
        case "client_chat":
          logger.info("inside client_chat");
          player?.roomInstance?.broadcast({
            type: "server_chat",
              payload: {
                  message: msg.payload.message,
                  from: player_id
              }
          });
          break;
        
        // handle client (paddle move)
        case "client_input":
          player?.roomInstance?.Game?.handlePlayerInput(player, msg);
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