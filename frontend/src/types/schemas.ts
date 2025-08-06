import { z } from "zod";


// componant

export type Component = {
  render: () => string;
  init?: () => void;
  cleanup?: () => void;
};

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
    to: z.string().optional(),
  }),
});

const RejectMessageSchema = z.object({
  type: z.literal("reject"),
  payload: z.object({
    reason: z.string(),
  }),
});

export const WSMessageSchema = z.union([
  AuthMessageSchema,
  StateMessageSchema,
  ChatMessageSchema,
  RejectMessageSchema,
]);

export type WSMessage = z.infer<typeof WSMessageSchema>;

export function parseWSMessage(data: unknown): WSMessage {
  return WSMessageSchema.parse(data);
}
