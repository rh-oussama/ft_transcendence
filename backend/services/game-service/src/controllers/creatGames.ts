import { FastifyRequest, FastifyReply } from "fastify";
import { CreateGameRequestBodySchema } from "../types/schemas.js";
import { handleGameCreation } from "../services/handleGameCreation.js";
import { printGameState } from "../utils/logger.js"

export const createGame = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const parseResult = CreateGameRequestBodySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        statusCode: 400,
        code: "ERROR",
        error: "Invalid request body",
        details: parseResult.error.issues,
      });
    }
    const response = handleGameCreation(parseResult.data);
    printGameState();
    return reply.status(response.statusCode).send(response);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      statusCode: 500,
      code: "ERROR",
      error: "Internal server error",
    });
  }
};
