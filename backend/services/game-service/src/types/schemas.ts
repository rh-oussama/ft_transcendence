import { z } from "zod";
import type WebSocket from 'ws';
import jwt from "jsonwebtoken";
import { ServerWSMessage } from "./serverSchemasWs.js";
import Game from "../services/gameLogic.js"

export interface player {
  id: string;
  ws?: WebSocket;
  roomInstance?: room;
}

export interface room {
  id: string;
  players: player[];
  mode: "friend" | "matchmaking" | "ai";
  broadcast: (message: ServerWSMessage) => void;
  Game?: Game;
  createdAt: Date;
}


// Zod Schemas

export const CreateGameRequestBodySchema = z.object({
    player_id: z.string(),
    mode: z.enum(["friend", "matchmaking", "ai"]),
    opponent_username: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => data.mode !== "friend" || !!data.opponent_username,
    {
      message: "opponent_username is required when mode is 'friend'",
      path: ["opponent_username"],
    }
  );

export type CreateGameRequestBody = z.infer<typeof CreateGameRequestBodySchema>;

export interface CreateGameResponseBody {
  statusCode: number;
  code: string;
  data: {
    status: string;
    game_id: string;
  };
}



// use zod for running parsind and type (server => client)
 

export const BallSchema = z.object({
  x: z.number(),
  y: z.number(),
  radius: z.number().default(8),
  velocityX: z.number(),
  velocityY: z.number(),
});

export const PaddleSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().default(10),
  height: z.number().default(80),
});

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number(),
  side: z.enum(["left", "right"]),
  paddle: PaddleSchema,
  
});



export type BallCor = z.infer<typeof BallSchema>;
export type PlayerCor = z.infer<typeof PlayerSchema>;
export type PaddleCOr = z.infer<typeof PaddleSchema>;




/////////////////

export interface JWTPayload extends jwt.JwtPayload {
  player_id: string;
}
