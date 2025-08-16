import { FastifyInstance } from 'fastify';
import { player, CreateGameRequestBody, room } from "../types/schemas.js";
import { addToMatchmakingQueue} from "./matchMakingHandler.js"
import { logger, players } from '../app.js';
import { inviteGameHandler } from './inviteGameHandler.js';




export function handleGameCreation(data: CreateGameRequestBody) {

  logger.info({ requestData: data }, "Handling game creation request");
  const { player_id, mode, opponent_username } = data;
  const current_player: player = {
    id: player_id,
  };

  if (players.has(player_id)) {
    logger.warn({ player: current_player }, "Player already in a (game | matchmaking queue)");
    return {
      statusCode: 400,
      code: "ERROR",
      player_id: current_player.id,
      error: "Player already in a (game | matchmaking queue)",
    };
  }

  if (mode === "matchmaking") {
    logger.info({ player: current_player }, "Adding player to matchmaking queue");
    const roomId = addToMatchmakingQueue(current_player);
    if (roomId) {
      logger.info({ roomId }, "Match found and room created");
    } else {
      logger.info("Waiting for an opponent to join");
    }
    return {
      statusCode: 202,
      code: "SUCCESS",
      data: {
        status: roomId ? "started" : "waiting",
        message: roomId
          ? "Match found, game starting soon"
          : "Waiting for an opponent...",
      },
    };
  }
  

  if (mode === "friend") {
    inviteGameHandler(player_id, opponent_username);
  }

  logger.error("Unsupported game creation mode", { mode });
  return {
    statusCode: 400,
    code: "ERROR",
    error: "Unsupported mode",
  };
}
