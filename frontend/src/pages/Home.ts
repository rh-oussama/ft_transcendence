


export function Home(): string {
  return `
    <section class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 class="text-4xl font-extrabold text-indigo-700 mb-4">Welcome to the Home Page</h1>
        <p class="text-gray-600 mb-6">
          This is a modern SPA starter page using<span class="font-semibold text-indigo-500">Tailwind CSS</span>.
        </p>
        <a href="/login" class="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
          Get Started
        </a>
      </div>
    </section>
  `;
}

