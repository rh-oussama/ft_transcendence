import {z} from "zod"
import { PlayerSchema, BallSchema, PaddleSchema } from "./schemas.js";


const ServerAuthMessageSchema = z.object({
  type: z.literal("server_auth"),
  payload: z.object({
    status: z.enum(["success", "fail"]),
  }),
});

const ServerStateMessageSchema = z.object({
  type: z.literal("server_state"),
  payload: z.object({
    gameStatus: z.enum(["waiting", "playing", "finished"]),
    players: z.array(PlayerSchema).refine((players) => players.length === 0 || players.length === 2),
    ball: BallSchema
  }),
});

const ServerChatMessageSchema = z.object({
  type: z.literal("server_chat"),
  payload: z.object({
    message: z.string(),
    from: z.string(),
  }),
});

const ServerExitMessageSchema = z.object({
  type: z.literal("server_chat"),
  payload: z.object({
    message: z.string(),
    from: z.string(),
  }),
});

export type ServerExitMessage = z.infer<typeof ServerChatMessageSchema>;




export type ServerAuthMessage = z.infer<typeof ServerAuthMessageSchema>;
export type ServerStateMessage = z.infer<typeof ServerStateMessageSchema>;
export type ServerChatMessage = z.infer<typeof ServerChatMessageSchema>;


export const ServerWSMessageSchema = z.union([
  ServerStateMessageSchema,
  ServerChatMessageSchema,
  ServerAuthMessageSchema,
]);

export type ServerWSMessage = z.infer<typeof ServerWSMessageSchema>;

