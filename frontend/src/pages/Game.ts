import {gameScoreBoard, gameCanvas, gameChat} from "../components/GameCanvas.js"
import { redirectTo } from "../App.js";
import { WSMessage, parseWSMessage } from "../types/schemas.js";

export let gameSocket: WebSocket | null = null;





// export function Game(): string {
//   return `
//     <div id="game-container" style="min-height: 100vh; background: #1E1E2F; display: flex; flex-direction: column;">
//       ${gameScoreBoard()}
//       <div id="game-content" style="display: flex; flex: 1; gap: 2rem; padding: 2rem;">
//         ${gameCanvas()}
//         ${gameChat()}
//       </div>
//     </div>
//   `;
// }


export function Game(): string {
  return `
    <div id="game-container" style="min-height: 100vh; background: #1E1E2F; display: flex; flex-direction: column;">
      <div id="game-content" style="display: flex; flex: 1; gap: 2rem; padding: 2rem;">
        ${gameChat()}
      </div>
    </div>
  `;
}


function handleGameMessage(event: MessageEvent) {
  try {
    const message = parseWSMessage(JSON.parse(event.data));
    switch (message.type) {
      case "auth":
        break;
      case "state":
        break;
      case "chat":
        break;
      case "reject":
        redirectTo("/");
        break;
      default:
        gameSocket?.close();
    }
  } catch (err) {
    console.error("Invalid WS message:", err);
    gameSocket?.close();
  }
}




export function initGame(): void {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    alert('No JWT token found. Please log in again.');
    return;
  }

  gameSocket = new WebSocket(`ws://localhost:3000/ws/game?jwt=${token}`);
  (window as any).gameSocket = gameSocket; // global 

  gameSocket.onopen = () => {
    console.log('Game WebSocket connected');
  };

  // gameSocket.onmessage = handleGameMessage;

  gameSocket.onerror = (err) => {
    console.error('Game WebSocket error', err);
    redirectTo("/");
  };

  gameSocket.onclose = () => {
    redirectTo("/");
  };
}