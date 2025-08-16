import { Component } from '../types/schemas.js';
import { GameCanvas } from '../components/GameCanvas';
import { GameChat, addChatMessage } from '../components/gameChat.js';
import { GameScoreBoard } from '../components/gameScoreBoard.js';
import { Game } from '../game/GameLogic.js';

export let gameInstance: Game | null = null;

export const GamePage: Component = {
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
    
    gameInstance = new Game(document.getElementById("gameCanvas") as HTMLCanvasElement);
    gameInstance.connectWs();
    gameInstance.start();
    GameCanvas.init?.();
    GameChat.init?.();
    GameScoreBoard.init?.();
  },

  cleanup: () => {
    if (gameInstance) {
      gameInstance.disconnectWs();
      gameInstance = null;
    }
    
    GameCanvas.cleanup?.();
    GameChat.cleanup?.();
  }
};
