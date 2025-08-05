import {gameScoreBoard, gameCanvas, gameChat} from "../components/GameCanvas.js"

export let gameSocket: WebSocket | null = null;


export function Game(): string {
  return `
    ${gameScoreBoard()}
    ${gameCanvas()}
    ${gameChat()}
  `;
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

  gameSocket.onmessage = (event) => {
    // const data = JSON.parse(event.data);
    console.log('Game event:', event.data);
  };

  gameSocket.onerror = (err) => {
    console.error('Game WebSocket error', err);
  };

  gameSocket.onclose = () => {
    console.log('Game WebSocket closed');
  };
}