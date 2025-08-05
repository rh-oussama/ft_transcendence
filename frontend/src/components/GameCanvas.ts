export function gameScoreBoard(): string {
  return `
  <header class="w-full px-8 py-3 bg-[#1E1E2F] flex justify-between items-center shadow-lg">
      <h1 class="text-lg font-semibold tracking-wide text-gray-200">PingPong</h1>
    </div>

    <div class="flex items-center gap-6 bg-[#2E2E3E] rounded-3xl px-6 py-3 text-sm font-semibold text-gray-300 shadow-sm select-none">
      <img src="https://i.pravatar.cc/32?img=15" alt="Player 1" class="w-8 h-8 rounded-full border border-[#5A6A9B]" />
      <span class="text-[#7486b3]">Nour</span>
      <span class="text-lg font-bold">5</span>
      <span class="text-gray-500">:</span>
      <span class="text-lg font-bold">4</span>
      <span class="text-[#7486b3]">Khalid</span>
      <img src="https://i.pravatar.cc/32?img=18" alt="Player 2" class="w-8 h-8 rounded-full border border-[#5A6A9B]" />
    </div>

    <div class="flex items-center gap-6 font-mono text-sm text-gray-400">
      <span class="flex items-center gap-2">
        <svg class="w-5 h-5 text-[#5A6A9B]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        Ping: 12ms
      </span>

      <button
        aria-label="Game Information"
        title="Game Information"
        class="p-2 rounded hover:bg-[#5A6A9B]/20 transition"
      >
        <svg class="w-6 h-6 text-gray-400 hover:text-gray-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </button>

      <button class="bg-[#5A6A9B] hover:bg-[#7486b3] text-white px-5 py-2 rounded-full font-semibold transition">Exit</button>
    </div>
  </header>
  `
}

export function gameChat(): string {
  return `
    <style>
    /* Scrollbar for chat */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #5A6A9B;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: #7486b3;
    }
  </style>
    <aside class="w-96 bg-[#1E1E2F] rounded-3xl flex-col shadow-lg border border-[#3B3B4F] hidden lg:flex">
      <header class="px-6 py-4 border-b border-[#3B3B4F] text-gray-400 font-semibold text-lg select-none">Live Chat</header>
      <div
        id="chatMessages"
        class="flex-1 px-6 py-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#5A6A9B] scrollbar-track-transparent"
      >
        <p><span class="font-semibold text-[#7486b3]">Nour:</span> Ready for the match?</p>
        <p><span class="font-semibold text-[#5A6A9B]">Khalid:</span> Let’s win this!</p>
      </div>
      <form class="px-6 py-4 border-t border-[#3B3B4F] flex gap-4">
        <input
          type="text"
          placeholder="Type your message..."
          class="flex-1 bg-[#2E2E3E] rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A6A9B] transition"
          autocomplete="off"
          id="chatInput"
        />
        <button
          type="submit"
          class="bg-[#5A6A9B] hover:bg-[#7486b3] text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Send
        </button>
      </form>
    </aside>
  `
}


export function gameCanvas(): string {
  return `
    <main class="flex flex-1 p-8 gap-8 overflow-hidden">
    <section class="flex-1 rounded-3xl shadow-lg bg-[#1E1E2F] flex justify-center items-center relative">
      <canvas
        id="gameCanvas"
        width="960"
        height="540"
        class="max-w-full max-h-full rounded-3xl border border-[#3B3B4F]"
        style="background: radial-gradient(circle at center, #2E2E3E, #1E1E2F);"
      ></canvas>
    </section>
  `;
}
