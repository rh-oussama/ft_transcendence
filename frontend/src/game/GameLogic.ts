import { Player, Ball, Paddle, ClientInputMessage, ServerWSMessage, ServerStateMessage } from '../types/schemas.js';
import { redirectTo } from '../App.js';
import { addChatMessage } from '../components/gameChat.js';
import { updateGameScore } from '../components/gameScoreBoard.js';

export class Game {
    
    CANVA_WIDTH: number = 960;
    CANVA_HEIGHT: number = 540;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    gameState: 'waiting' | 'playing' | 'paused' | 'finished';
    
    ws: WebSocket | null = null;
    players: Player[] = [];
    ball: Ball;
    pressedKeys: Set<string> = new Set();
    
    constructor(context: HTMLCanvasElement) {
        this.canvas = context;
        this.canvas.width = this.CANVA_WIDTH;
        this.canvas.height = this.CANVA_HEIGHT;
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Failed to get 2D context");
        }
        this.ctx = ctx;
        this.gameState = "waiting";
        this.ball = {
            x: 0,
            y: 0,
            radius: 10,
            velocityX: 0,
            velocityY: 0
        };
        this.setupKeyListeners();
    }
 
    setupKeyListeners() {
        window.addEventListener('keydown', (e) => {
            if (!this.pressedKeys.has(e.key)) {
                this.pressedKeys.add(e.key);
                this.handleKeyDown(e.key);
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.pressedKeys.has(e.key)) {
                this.pressedKeys.delete(e.key);
                this.handleKeyUp(e.key);
            }
        });
    }

    handleKeyDown(key: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        let direction: "up" | "down" | undefined;

        if (key === 'ArrowUp' || key === 'w') {
            direction = "up";
        } else if (key === 'ArrowDown' || key === 's') {
            direction = "down";
        } else {
            return;
        }

        const message: ClientInputMessage = {
            type: "client_input",
            payload: {
                action: "paddle_move",
                direction: direction
            }
        };

        this.ws.send(JSON.stringify(message));
    }

    handleKeyUp(key: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'w' || key === 's') {
            const message: ClientInputMessage = {
                type: "client_input",
                payload: {
                    action: "paddle_stop"
                }
            };

            this.ws.send(JSON.stringify(message));
        }
    }

    handleServerMessage(message: ServerWSMessage) {
        switch (message.type) {
            case 'server_state':
                if (message.payload.gameStatus === "playing")
                    this.updateGameState(message);
                if (message.payload.gameStatus === "finished"){
                    this.disconnectWs();
                    this.updateGameState(message);

                }
                break;
            
            case 'server_auth':
                console.log('Auth status:', message.payload.status);
                if (message.payload.status === "fail") {
                    redirectTo("/");
                }
                break;
             
            case 'server_chat':
                console.log(`Chat from ${message.payload.from}: ${message.payload.message}`);
                addChatMessage(message.payload.from, message.payload.message)
                break;
           
            default:
                this.ws?.close();
                redirectTo("/");
                break;
        }
    }

    updateGameState(stateMessage: ServerStateMessage) {
        const { gameStatus, players, ball } = stateMessage.payload;
        
        this.gameState = gameStatus;
        this.players = players;
        this.ball = ball;
        updateGameScore(players[1].score, players[0].score)
    }

    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.fillStyle = '#fff';
        
        this.players.forEach(player => {
            const paddleX = player.side === 'left' ? 20 : this.canvas.width - 30;
            
            this.ctx.fillRect(
                player.paddle.x,
                player.paddle.y,
                player.paddle.width,
                player.paddle.height
            );
        });

        if (this.ball && this.gameState === "playing") {
            this.ctx.beginPath();
            this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        if (this.gameState === 'waiting') {
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Waiting for players...', this.canvas.width / 2 - 100, this.canvas.height / 2);
        } else if (this.gameState === 'finished') {
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Game Finished', this.canvas.width / 2 - 80, this.canvas.height / 2);
        }
    }

    start() {
        this.renderLoop();
    }

    renderLoop() {
        this.render();
        requestAnimationFrame(() => this.renderLoop());
    }

    
    connectWs() {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            alert('No JWT token found. Please log in again.');
            return;
        }
        this.ws = new WebSocket(`ws://localhost/v1/ws/game?jwt=${token}`);

        this.ws.onopen = () => {
            console.log('Game WebSocket connected');
        }
        
        this.ws.onmessage = (event) => {
            try {
                const message: ServerWSMessage = JSON.parse(event.data);
                // console.log(`recived json: ${JSON.stringify(message)}`)
                this.handleServerMessage(message);
            } catch (error) {
                console.error('Failed to parse server message:', error);
            }
        };


        this.ws.onerror = (err) => {
            console.error('Game WebSocket error', err);
            redirectTo("/");
        };

        this.ws.onclose = () => {
            console.log('Game WebSocket disconnected');
        };
    }

    disconnectWs() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
