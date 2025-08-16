import { z } from "zod";


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



export const ClientWSMessageSchema = z.union([
  ClientInputMessageSchema,
  ClientChatMessageSchema,
  ClientAuthMessageSchema,
  ClientExitMessageSchema,

]);

export type ClientWSMessage = z.infer<typeof ClientWSMessageSchema>;
