import { PlayerCor, room, BallCor, player } from "../types/schemas.js";
import { ClientInputMessage } from "../types/clientSchemasWs.js";
import { console } from "inspector";

class Game {
    CANVA_WIDTH: number = 960;
    CANVA_HEIGHT: number = 540;
    BALL_SPEED: number = 5;
    PADDLE_SPEED: number = 8;
    PADDLE_OFFSET: number = 10;
    
    
    players: PlayerCor[];
    ball: BallCor;
    room: room;
    gameLoop: NodeJS.Timeout | null = null;
    isRunning: boolean = false;
    lastScorer: "left" | "right" | null = null;


    playerKey: Map<string, {
        isMoving: boolean;
        direction: "up" | "down" | undefined;
    }> = new Map();


    constructor(roomInstance: room) {
        this.room = roomInstance;
        
        const [player1, player2] = roomInstance.players;

        // ball position (init)
        this.ball = {
            x: this.CANVA_WIDTH / 2,
            y: this.CANVA_HEIGHT / 2,
            radius: 10,
            velocityX: 5,
            velocityY: 3
        };

        // player position (init)
        this.players = [
            {
                id: player1.id,
                name: "Player 1",
                score: 0,
                side: "right",
                paddle: {
                    x: this.CANVA_WIDTH - this.PADDLE_OFFSET - 10,
                    y: this.CANVA_HEIGHT / 2 - 40,
                    width: 10,
                    height: 80
                }
            },
            {
                id: player2.id,
                name: "Player 2",
                score: 0,
                side: "left",
                paddle: {
                    x: this.PADDLE_OFFSET,
                    y: this.CANVA_HEIGHT / 2 - 40,
                    width: 10,
                    height: 80
                }
            }
        ];

        this.playerKey.set(player1.id, { isMoving: false, direction: undefined });
        this.playerKey.set(player2.id, { isMoving: false, direction: undefined });
    
    }


    start(): void {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.gameLoop = setInterval(() => {
            this.update();
        }, 1000 / 30);
        
        console.log(`Game ${this.room.id} started`);
    }

    stop(): void {
        this.isRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        console.log(`Game ${this.room.id} stopped`);
    }

    update(): void {
        try {
            this.updateBall();
            this.updatePaddles();
            this.checkCollisions();
            this.checkScore();
            this.broadcastGameState();
        } catch (error) {
            console.error(`Game ${this.room.id} update error:`, error);
            this.stop();
        }
    }

    updateBall(): void {
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        
        if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.CANVA_HEIGHT) {
            this.ball.velocityY = -this.ball.velocityY!;
        }
    }

    checkCollisions(): void {
    
        const leftPlayer = this.players.find(p => p.side === "left");
        const rightPlayer = this.players.find(p => p.side === "right");
    
        if (!leftPlayer || !rightPlayer)
            return;

        // left collsio
        if (this.ball.x - this.ball.radius <= (leftPlayer.paddle.x + leftPlayer.paddle.width) && 
            this.ball.velocityX < 0 &&
            this.ball.y >= leftPlayer.paddle.y &&
            this.ball.y <= leftPlayer.paddle.y + leftPlayer.paddle.height) {

                this.ball.velocityX = -this.ball.velocityX;
            }
        
        //righ collision
        if (this.ball.x + this.ball.radius >= rightPlayer.paddle.x &&
        this.ball.velocityX > 0 &&
        this.ball.y >= rightPlayer.paddle.y &&
        this.ball.y <= rightPlayer.paddle.y + rightPlayer.paddle.height) {
            this.ball.velocityX = -this.ball.velocityX;
        }

    }

    checkScore(): void {
        if (this.ball.x > this.CANVA_WIDTH) {
        const leftPlayer = this.players.find((p) => p.side === "left");
        if (leftPlayer) {
            leftPlayer.score++;
            this.resetBall("left");
            }
        }

        if (this.ball.x < 0) {
            const rightPlayer = this.players.find((p) => p.side === "right");
            if (rightPlayer) {
                rightPlayer.score++;
                this.resetBall("right");
            }
        }
    }
    
    resetBall(lastScorer: "left" | "right"): void {
        this.ball.x = this.CANVA_WIDTH / 2;
        this.ball.y = this.CANVA_HEIGHT / 2;

        const direction = lastScorer === "left" ? 1 : -1;
        this.ball.velocityX = this.BALL_SPEED * direction;
    }
    
    handlePlayerInput(player: player, msg: ClientInputMessage): void {
        const inputState = this.playerKey.get(player.id);
        if (!inputState) {
            console.warn(`Player ${player.id} not found in game ${this.room.id}`);
            return;
        }

        switch (msg.payload.action) {
            case "paddle_move":
                if (msg.payload.direction) {
                    inputState.isMoving = true;
                    inputState.direction = msg.payload.direction;
                }
                break;
            
            case "paddle_stop":
                inputState.isMoving = false;
                inputState.direction = undefined;
                break;
        }
    }


    updatePaddles(): void {
        this.players.forEach(player => {
            const inputState = this.playerKey.get(player.id);
        
            if (inputState && inputState.isMoving && inputState.direction) {
                const moveAmount = inputState.direction === "up" ? -this.PADDLE_SPEED : this.PADDLE_SPEED;
                const newY = player.paddle.y + moveAmount;
                console.log(`new y ${newY}`);
                if (newY >= 0 && newY <= this.CANVA_HEIGHT - player.paddle.height) {
                    player.paddle.y = newY;
                }
            }
        });
    }


    broadcastGameState(): void {
        const gameState = {
            type: "server_state" as const,
            payload: {
                gameStatus: "playing" as const,
                players: this.players,
                ball: this.ball
            }
        };
        this.room.broadcast(gameState);
    };
}

export default Game;