import { Component } from "../types/schemas.js";

export const GameScoreBoard: Component = {
    render: () => `
        <header class="w-full px-8 py-3 bg-[#1E1E2F] flex justify-between items-center shadow-lg">
            <h1 class="text-lg font-semibold tracking-wide text-gray-200">PingPong</h1>
            <div class="flex items-center gap-6 bg-[#2E2E3E] rounded-3xl px-6 py-3 text-sm font-semibold text-gray-300 shadow-sm select-none">
                <img src="https://i.pravatar.cc/32?img=15" alt="Player 1" class="w-8 h-8 rounded-full border border-[#5A6A9B]" />
                <span id="player1-name" class="text-[#7486b3]">Nour</span>
                <span id="player1-score" class="text-lg font-bold">5</span>
                <span class="text-gray-500">:</span>
                <span id="player2-score" class="text-lg font-bold">4</span>
                <span id="player2-name" class="text-[#7486b3]">Khalid</span>
                <img src="https://i.pravatar.cc/32?img=18" alt="Player 2" class="w-8 h-8 rounded-full border border-[#5A6A9B]" />
            </div>
            <div class="flex items-center gap-6 font-mono text-sm text-gray-400">
                <span id="ping" class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-[#5A6A9B]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Ping: 12ms
                </span>
                <button id="info-btn" aria-label="Game Information" title="Game Information" class="p-2 rounded hover:bg-[#5A6A9B]/20 transition">
                    <svg class="w-6 h-6 text-gray-400 hover:text-gray-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                </button>
                <button id="exit-btn" class="bg-[#5A6A9B] hover:bg-[#7486b3] text-white px-5 py-2 rounded-full font-semibold transition">
                    Exit
                </button>
            </div>
        </header>
    `,
    
    init: () => {
        const exitBtn = document.getElementById('exit-btn');
        const infoBtn = document.getElementById('info-btn');

        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                console.log('Exit game');
            });
        }

        if (infoBtn) {
            infoBtn.addEventListener('click', () => {
                console.log('Show game info');
            });
        }
    },

    cleanup: () => {
        const exitBtn = document.getElementById('exit-btn');
        const infoBtn = document.getElementById('info-btn');

        if (exitBtn) {
            exitBtn.removeEventListener('click', () => {});
        }
        if (infoBtn) {
            infoBtn.removeEventListener('click', () => {});
        }
    }
};