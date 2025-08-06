import {player, room} from "../types/schemas.js"
import { v4 as uuidv4 } from 'uuid';
import { matchmakingQueue, players, rooms } from "../app.js";


export function addToMatchmakingQueue(newPlayer: player): string | null {
    

    matchmakingQueue.push(newPlayer);
    players.set(newPlayer.id, newPlayer);
    newPlayer.roomId = "none";
    if (matchmakingQueue.length >= 2) {
        const getTwoPLayer = matchmakingQueue.splice(0, 2);
        const roomId = uuidv4();
        const newRoom: room = {
            id: roomId,
            players: getTwoPLayer,
            mode: "matchmaking",
            createdAt: new Date(),
        };
        rooms.set(roomId, newRoom);
        getTwoPLayer.forEach(p => p.roomId = roomId);
        return roomId;
    }

    return null;
}