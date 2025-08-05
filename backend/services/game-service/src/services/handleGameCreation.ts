import { FastifyInstance } from 'fastify';
import { player, CreateGameRequestBody, room } from "../types/schemas.js";
import { addToMatchmakingQueue} from "./matchmaking.js"
import { logger } from '../app.js';



export const matchmakingQueue: player[] = [];
export const rooms = new Map<string, room>();
export const players = new Map<string, player>();



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
  

  /*
  // If you decide to support friend mode with logging, you can uncomment and add logging as needed:
  if (mode === "friend") {
    if (!opponent_username) {
      logger.error("opponent_username is required for friend mode");
      return {
        statusCode: 400,
        code: "ERROR",
        error: "opponent_username is required for friend mode",
      };
    }
    const opponent = [...players.values()].find(
      (p) => p.username === opponent_username
    );
    if (!opponent) {
      logger.error("Opponent not found", { opponent_username });
      return {
        statusCode: 404,
        code: "ERROR",
        error: "Opponent not found",
      };
    }
    const roomId = uuidv4();
    const newRoom: room = {
      id: roomId,
      players: [current_player, opponent],
      mode: "friend",
      createdAt: new Date(),
    };
    rooms.set(roomId, newRoom);
    logger.info({ roomId }, "Friend game created");
    return {
      statusCode: 202,
      code: "SUCCESS",
      data: {
        status: "waiting",
        message: "Friend game created, waiting for opponent to join",
      },
    };
  }
  */

  logger.error("Unsupported game creation mode", { mode });
  return {
    statusCode: 400,
    code: "ERROR",
    error: "Unsupported mode",
  };
}
