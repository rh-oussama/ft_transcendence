import {player, room} from "../types/schemas.js"
import { v4 as uuidv4 } from 'uuid';
import { matchmakingQueue, players, rooms } from "../app.js";
import { logger } from "../app.js";
import { WebSocket } from 'ws';
import Game from "./gameLogic.js";




export function addToMatchmakingQueue(newPlayer: player): string | null {
    if (!newPlayer || !newPlayer.id) {
        logger.error('invalid player');
        return null;
    }
    
    if (players.has(newPlayer.id)) {
        logger.warn(`Player ${newPlayer.id} already exists in matchmaking`);
        return null;
    }
    
    matchmakingQueue.push(newPlayer);
    players.set(newPlayer.id, newPlayer);
    
    logger.info(`Player ${newPlayer.id} added to matchmaking queue. Queue size: ${matchmakingQueue.length}`);

    if (matchmakingQueue.length >= 2) {
        return createMatch();
    }
    return null;
}

function createMatch(): string {
    try {
        const twoPlayers = matchmakingQueue.splice(0, 2);                
        const roomId = uuidv4();
        const newRoom: room = {
            id: roomId,
            players: twoPlayers,
            mode: "matchmaking",
            createdAt: new Date(),
            broadcast: function(message) {
                logger.info(`Broadcasting message to room ${this.id}`);
                this.players.forEach(player => {
                    if (player.ws?.readyState === WebSocket.OPEN) {
                        try {
                            player.ws.send(JSON.stringify(message));
                            logger.debug(`Message sent to player ${player.id}`);
                        } catch (error) {
                            logger.error(`Failed to send message to player ${player.id}:`, error);
                        }
                    } else {
                        logger.warn(`Player ${player.id} WebSocket not ready`);
                    }
                });           
            }
        };

        newRoom.Game = new Game(newRoom);
        rooms.set(roomId, newRoom);
        twoPlayers.forEach(player => {
            player.roomInstance = newRoom;
        });
        logger.info(`Match created with room ID: ${roomId}, players: ${twoPlayers.map(p => p.id).join(', ')}`);
        newRoom.Game.start();
        return roomId;
        
    } catch (error) {
        logger.error('Failed to create match:', error);
        throw error;
    }
}