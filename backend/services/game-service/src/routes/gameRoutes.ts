import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createGame } from "../controllers/creatGames.js";
import jwt from "jsonwebtoken";

export const SECRET = "48ed45ab3c1792c354bce19841b0f42edb32648c61d7cb9bb174efd6068c3112";

function creatjwt(request: FastifyRequest, reply: FastifyReply) {
    const { player_id } = request.body as { player_id?: string };

    if (!player_id) {
        return reply.status(400).send({
            statusCode: 400,
            code: "ERROR",
            error: "username required",
        });
    }
    const token = jwt.sign({ player_id }, SECRET);
    return reply.send({
        statusCode: 200,
        code: "SUCCESS",
        data: { token },
    });
}

export default async function routes(fastify: FastifyInstance) {
    fastify.post("/v1/create-game", createGame);
    fastify.post("/v1/generate-jwt", creatjwt);
}


