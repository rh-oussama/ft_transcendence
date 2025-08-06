import { Component } from '../types/schemas.js';
import { GameCanvas } from '../components/GameCanvas';
import { GameChat, addChatMessage } from '../components/gameChat.js';
import { GameScoreBoard } from '../components/gameScoreBoard.js';
import { redirectTo } from "../App.js";
import { parseWSMessage } from "../types/schemas.js";

export let gameSocket: WebSocket | null = null;

export const Game: Component = {
  render: () => `
    <div id="game-container" class="min-h-screen bg-[#1E1E2F] flex flex-col">
      <div id="scoreboard">
        ${GameScoreBoard.render()}
      </div>
      <div id="game-content" class="flex flex-1 gap-8 p-8">
        ${GameCanvas.render()}
        ${GameChat.render()}
      </div>
    </div>
  `,

  init: () => {
    initWebSocket();
    
    // init child
    GameCanvas.init?.();
    GameChat.init?.();
  },

  cleanup: () => {
    if (gameSocket) {
      gameSocket.close();
      gameSocket = null;
    }
    
    // clean child
    GameCanvas.cleanup?.();
    GameChat.cleanup?.();
  }
};

function initWebSocket() {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    alert('No JWT token found. Please log in again.');
    return;
  }

  gameSocket = new WebSocket(`ws://localhost:3000/ws/game?jwt=${token}`);
  
  gameSocket.onopen = () => console.log('Game WebSocket connected');
  gameSocket.onmessage = handleGameMessage;
  gameSocket.onerror = (err) => {
    console.error('Game WebSocket error', err);
    redirectTo("/");
  };
}

function handleGameMessage(event: MessageEvent) {
  try {
    const message = parseWSMessage(JSON.parse(event.data));
    console.log('Parsed message:', message);
    
    switch (message.type) {
      case "auth":
        if (message.payload.status === "fail") {
          redirectTo("/");
        }
        break;
      case "state":
        // Handle game state update
        break;
      case "chat":
        addChatMessage(message.payload.from, message.payload.message)
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