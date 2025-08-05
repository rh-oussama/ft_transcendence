export function SelectGameMode(): string {
  return `
    <section style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #f7f7f7; padding: 20px;">
      <div style="display: flex; gap: 20px;">
        <div id="play-friend" style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; min-width: 150px; text-align: center; cursor: pointer;">
          <h2 style="font-family: Arial, sans-serif; color: #555;">Play with Friend</h2>
        </div>
        <div id="play-ai" style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; min-width: 150px; text-align: center; cursor: pointer;">
          <h2 style="font-family: Arial, sans-serif; color: #555;">Play with AI</h2>
        </div>
        <div id="matchmaking" style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; min-width: 150px; text-align: center; cursor: pointer;">
          <h2 style="font-family: Arial, sans-serif; color: #555;">Matchmaking</h2>
        </div>
      </div>
    </section>
  `;
}




export function initSelectGameMode(): void {
  const matchmaking_btn = document.getElementById("matchmaking");
  if (!matchmaking_btn)
      return;

  matchmaking_btn.addEventListener("click", async () => {
    const player_id = localStorage.getItem("player_id");
    if (!player_id) {
      alert("Player ID not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch("/v1/create-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id, mode: "matchmaking" }),
      });

      const data = await res.json();

      if (res.ok) {
        history.pushState({}, "", "/game");
        window.dispatchEvent(new Event("popstate"));
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Request error: " + err.message);
    }
  });
}

