let socket: WebSocket | null = null;

export function connectWebSocket(token: string): void {
  socket = new WebSocket(`ws://localhost:3000/ws?jwt=${token}`);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error", err);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };
}

export function sendMessage(msg: any): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
}