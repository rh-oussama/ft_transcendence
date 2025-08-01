import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function routes(fastify: FastifyInstance) {
    
    fastify.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            return { 
                status: "success",
                message: "Test endpoint working" 
            };
        } catch (error) {
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });
}