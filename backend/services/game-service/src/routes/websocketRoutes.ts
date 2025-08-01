import { FastifyInstance, FastifyRequest } from "fastify";
import { WebSocket } from "ws";

export default async function websocketRoutes(fastify: FastifyInstance) {
    
    fastify.get("/ws", {websocket: true}, (socket: WebSocket, req: FastifyRequest) => {
                
        socket.on("message", (message: Buffer) => {
            const messageStr = message.toString();
            console.log("Received:", messageStr);
            socket.send("pong");
        });
        
        socket.on("close", () => {
            console.log("Client disconnected");
        });
    }
    );
}
