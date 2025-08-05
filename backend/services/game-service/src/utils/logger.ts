import {matchmakingQueue, rooms, players} from "../services/handleGameCreation.js"


export function printGameState(): void {
  const lines: string[] = [];
  const border = "========================================";

  // Top border & title
  lines.push(border);
  lines.push("=           === Game State ===         =");
  lines.push(border);

  lines.push("= Matchmaking Queue:");
  if (matchmakingQueue.length > 0) {
    matchmakingQueue.forEach((player, index) => {
      lines.push(`=   ${index + 1}. ${player.id} (ID: ${player.id})`);
    });
  } else {
    lines.push("=   The queue is empty.");
  }
  lines.push(border);

  lines.push("= Active Rooms:");
  if (rooms.size > 0) {
    for (const [roomId, room] of rooms.entries()) {
      let roomLine = `= Room ${roomId}: Mode - ${room.mode}, Players - ${room.players.map(p => p.id).join(', ')}, Created At - ${room.createdAt.toISOString()}`;
      if (room.data) {
        roomLine += `, Data - ${JSON.stringify(room.data)}`;
      }
      lines.push(roomLine);
    }
  } else {
    lines.push("=   No active rooms.");
  }
  lines.push(border);

  lines.push("= Active Players:");
  if (players.size > 0) {
    for (const [playerId, player] of players.entries()) {
      lines.push(`=   ${player.id} (ID: ${playerId}) (ROOMID: ${player.roomId})`);
    }
  } else {
    lines.push("=   No active players.");
  }
  lines.push(border);

  console.log("\n" + lines.join("\n") + "\n");
}
