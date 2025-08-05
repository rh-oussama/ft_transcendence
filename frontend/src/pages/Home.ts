export function Home(): string {
  return `
    <section style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #f7f7f7; padding: 20px;">
      <input
        id="username"
        type="text"
        placeholder="username"
        style="padding:10px; font-size:16px; width:300px; margin-bottom:10px; border:1px solid #ccc; border-radius:4px;"
      />
      <button
        id="generateBtn"
        style="padding:10px 20px; font-size:16px; border:none; background:#3b82f6; color:white; border-radius:4px; cursor:pointer;"
      >
        &#9658;
      </button>
    </section>
  `;
}

export function initHome(): void {
  const btn = document.getElementById('generateBtn');
  const input = document.getElementById('username') as HTMLInputElement;
  
  if (!btn || !input) return;
  
  btn.addEventListener('click', async () => {
    const player_id = input.value.trim();
    if (!player_id) {
      alert('Please enter a username');
      return;
    }

    try {
      const res = await fetch('/v1/generate-jwt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id }),
      });
      const data = await res.json();

      if (res.ok) {
        const token = data.data.token;
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('player_id', player_id);
        history.pushState({}, '', '/select-mode');
        window.dispatchEvent(new Event('popstate'));
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Fetch error: ' + e.message);
    }
  });

}
