import { z } from "zod";


// componant

export type Component = {
  render: () => string;
  init?: () => void;
  cleanup?: () => void;
};

// use zod for running parsind and type

const ClientInputMessageSchema = z.object({
  type: z.literal("client_input"),
  payload: z.object({
    action: z.enum(["paddle_move", "paddle_stop"]),
    direction: z.enum(["up", "down"]).optional(),
  }),
});

const ClientChatMessageSchema = z.object({
  type: z.literal("client_chat"),
  payload: z.object({
    message: z.string(),
  }),
});

const ClientAuthMessageSchema = z.object({
  type: z.literal("client_auth"),
  payload: z.object({
    token: z.string(),
  }),
});

const ClientExitMessageSchema = z.object({
  type: z.literal("client_exit"),
})



export type ClientInputMessage = z.infer<typeof ClientInputMessageSchema>;
export type ClientChatMessage = z.infer<typeof ClientChatMessageSchema>;
export type ClientAuthMessage = z.infer<typeof ClientAuthMessageSchema>;
export type ClientExitMessage = z.infer<typeof ClientExitMessageSchema>;





///////////// no need to parse 




export const BallSchema = z.object({
  x: z.number(),
  y: z.number(),
  radius: z.number().default(8),
  velocityX: z.number().optional(),
  velocityY: z.number().optional(),
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


const ServerAuthMessageSchema = z.object({
  type: z.literal("server_auth"),
  payload: z.object({
    status: z.enum(["success", "fail"]),
  }),
});

const ServerStateMessageSchema = z.object({
  type: z.literal("server_state"),
  payload: z.object({
    gameStatus: z.enum(["waiting", "playing", "paused", "finished"]),
    players: z.array(PlayerSchema).refine(
      (players) => players.length === 0 || players.length === 2
    ),
    ball: BallSchema,
  }),
});

const ServerChatMessageSchema = z.object({
  type: z.literal("server_chat"),
  payload: z.object({
    message: z.string(),
    from: z.string(),
  }),
});

const ServerRejectMessageSchema = z.object({
  type: z.literal("server_reject"),
  payload: z.object({
    reason: z.string(),
  }),
});


export type ServerAuthMessage = z.infer<typeof ServerAuthMessageSchema>;
export type ServerStateMessage = z.infer<typeof ServerStateMessageSchema>;
export type ServerChatMessage = z.infer<typeof ServerChatMessageSchema>;
export type ServerRejectMessage = z.infer<typeof ServerRejectMessageSchema>;

////////////////


export type Player = z.infer<typeof PlayerSchema>;
export type Paddle = z.infer<typeof PaddleSchema>;
export type Ball = z.infer<typeof BallSchema>;



export const ServerWSMessageSchema = z.union([
  ServerStateMessageSchema,
  ServerChatMessageSchema,
  ServerAuthMessageSchema,
  ServerRejectMessageSchema,
]);

export type ServerWSMessage = z.infer<typeof ServerWSMessageSchema>;
