import { z } from "zod";
import type WebSocket from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";

export interface player {
  id: string;
  ws?: WebSocket;
  roomId?: string;
}

export interface room {
  id: string;
  players: player[];
  mode: "friend" | "matchmaking" | "ai";
  data?: GameState;
  broadcast: (message: WSMessage) => void;
  createdAt: Date;
}

export interface GameState {
  ballPosition: { x: number; y: number };
  playerPositions: Record<string, { x: number; y: number }>;
  scores: Record<string, number>;
  lastUpdated: Date;
}

// Zod Schemas

export const CreateGameRequestBodySchema = z
  .object({
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



// use zod for running parsind and type
 
const AuthMessageSchema = z.object({
  type: z.literal("auth"),
  payload: z.object({
    status: z.enum(["success", "fail"]),
  }),
});

const StateMessageSchema = z.object({
  type: z.literal("state"),
  payload: z.object({
    gameStatus: z.enum(["waiting", "playing", "finished"]),
    players: z.array(z.string()),
    ball: z.object({
      x: z.number(),
      y: z.number(),
    }),
    paddles: z.object({
      a: z.object({ y: z.number() }),
      b: z.object({ y: z.number() }),
    }),
    scores: z.record(z.string(), z.number()),
  }),
});

const ChatMessageSchema = z.object({
  type: z.literal("chat"),
  payload: z.object({
    message: z.string(),
    from: z.string(),
  }),
});

const RejectMessageSchema = z.object({
  type: z.literal("reject"),
  payload: z.object({
    reason: z.string(),
  }),
});

export type AuthMessage = z.infer<typeof AuthMessageSchema>;
export type StateMessage = z.infer<typeof StateMessageSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type RejectMessage = z.infer<typeof RejectMessageSchema>;

export const WSMessageSchema = z.union([
  StateMessageSchema,
  ChatMessageSchema,
]);

export type WSMessage = z.infer<typeof WSMessageSchema>;


/////////////////

export interface JWTPayload extends jwt.JwtPayload {
  player_id: string;
}
