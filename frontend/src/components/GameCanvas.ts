export function gameCanvas(): string {
  return `
    <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <canvas
          id="pong-canvas"
          width="1000"
          height="400"
          class="block w-full rounded-xl shadow-lg bg-gray-900 border-4 border-blue-500 border-solid"
        ></canvas>
      </div>
    </div>
  `;
}