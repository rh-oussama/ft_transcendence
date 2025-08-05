import { z } from "zod";
import type WebSocket from 'ws';

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

