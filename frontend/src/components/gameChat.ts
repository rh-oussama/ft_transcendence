import { Component } from '../types/schemas.js';
import { ServerWSMessage, ClientChatMessage } from '../types/schemas.js';
import { gameInstance } from '../pages/Game.js';

export const GameChat: Component = {
  render: () => `
<style>
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #5a6a9b;
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: #7486b3;
    }
</style>
<aside class="w-96 bg-[#1E1E2F] rounded-3xl flex-col shadow-lg border border-[#3B3B4F] flex">
    <header class="px-6 py-4 border-b border-[#3B3B4F] text-gray-400 font-semibold text-lg select-none">Live Chat</header>

    <div id="chatMessages" class="flex-1 px-6 py-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#5A6A9B] scrollbar-track-transparent">
    </div>

    <form id="chatForm" class="px-6 py-4 border-t border-[#3B3B4F] flex gap-4">
        <input
            type="text"
            placeholder="Type your message..."
            class="flex-1 bg-[#2E2E3E] rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A6A9B] transition"
            autocomplete="off"
            id="chatInput"
            required
            minlength="1"
        />

        <button id="sendBtn" type="submit" class="bg-[#5A6A9B] hover:bg-[#7486b3] text-white font-semibold px-6 py-3 rounded-xl transition">
            Send
        </button>
    </form>
</aside>

  `,

  init: () => {
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput') as HTMLInputElement;
    const messages = document.getElementById('chatMessages');

    if (!form || !input || !messages)
      return;

    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;

      if (gameInstance?.ws && gameInstance?.ws.readyState === WebSocket.OPEN) {
        const chatMessage: ClientChatMessage  = {
          type: "client_chat" as const,
          payload: {
            message: message,
          }
        };
        gameInstance?.ws.send(JSON.stringify(chatMessage));
        input.value = '';
      } else {
        console.error('WebSocket is not connected');
      }
    });
},

  cleanup: () => {
    const form = document.getElementById('chatForm');
    if (form) {
      form.removeEventListener('submit', () => {});
    }
  }
};


export const addChatMessage = (from: string, message: string) => {
    const messagesList = document.getElementById('chatMessages');
    if (!messagesList)
      return;
    
    const messageElement = `
    <p>
      <span class="font-semibold text-[#7486b3]">${from}:</span> 
      ${message}
    </p>
    `;

    messagesList.innerHTML += messageElement;
    messagesList.scrollTop = messagesList.scrollHeight;
  }