import { player } from "../types/schemas.js";
import { logger, players } from '../app.js';
import { createMatch } from "./matchMakingHandler.js";


export function inviteGameHandler(player_id: string, opponent_username: (string | undefined)) {
  const playerOne: player = { id: player_id };
    
  if (players.has(playerOne.id)) {
    logger.warn(`Player ${playerOne.id} already exists in a room`);
    return {
      statusCode: 400,
      code: "ERROR",
      error: "Player already exists in a room",
    };
  }

  if (!opponent_username) {
    logger.error("opponent_username is required for friend mode");
    return {
      statusCode: 400,
      code: "ERROR",
      error: "opponent_username is required for friend mode",
    };
  }

  // player id from API
  const playerTwo: player = {
    id: "test",
  };

  if (!playerTwo.id) {
    logger.error("Opponent not found", { opponent_username });
    return {
      statusCode: 404,
      code: "ERROR",
      error: "Opponent not found",
    };
  }

  // opponent is already in a room
  if (players.has(playerTwo.id)) {
    logger.warn(`Opponent ${playerTwo.id} already exists in a room`);
    return {
      statusCode: 400,
      code: "ERROR",
      error: "Opponent already exists in a room",
    };
  }

  // TODO: redirect after the accept 
  players.set(playerOne.id, playerOne);
  players.set(playerTwo.id, playerTwo);
  createMatch(playerOne, playerTwo, "friend");  

  return {
    statusCode: 200,
    code: "SUCCESS",
    message: "Private game invite validated successfully",
  };
}