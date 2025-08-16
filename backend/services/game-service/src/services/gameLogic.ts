import { PlayerCor, room, BallCor, player } from "../types/schemas.js";
import { ClientInputMessage } from "../types/clientSchemasWs.js";
import { console } from "inspector";
import { Numeric } from "zod/v4/core/util.cjs";

import { matchmakingQueue, players, rooms } from "../app.js";


class Game {
    
    TOTAL_ROUND: number = 5;
    CANVA_WIDTH: number = 960;
    CANVA_HEIGHT: number = 540;

    // ball speed and move
    BALL_SPEED: number = 5;

    // paddle spped
    PADDLE_SPEED: number = 8;
    
    // offset from the edge
    PADDLE_OFFSET: number = 10;
    
    
    players: PlayerCor[];
    ball: BallCor;
    room: room;
    gameLoop: NodeJS.Timeout | null = null;
    isRunning: boolean = false;
    isGameReady: boolean = false;
    lastScorer: "left" | "right" | null = null;


    playerKey: Map<string, {
        isMoving: boolean;
        direction: "up" | "down" | undefined;
    }> = new Map();


    constructor(roomInstance: room) {
        this.room = roomInstance;
        
        const [player1, player2] = roomInstance.players;

        // ball position (init)
        const {x, y} = this.calculateVelocity(40);
        this.ball = {
            x: this.CANVA_WIDTH / 2,
            y: this.CANVA_HEIGHT / 2,
            radius: 10,
            velocityX: x,
            velocityY: y
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


    calculateVelocity(angleDegrees: number) {
        const angleRadians = angleDegrees * (Math.PI / 180);
        const velocityX = this.BALL_SPEED * Math.cos(angleRadians);
        const velocityY = this.BALL_SPEED * Math.sin(angleRadians);
        return { x: velocityX, y: velocityY };
    }

    start(): void {
        if (this.isRunning)
            return;
        
        this.isRunning = true;
        this.gameLoop = setInterval(() => {
            
            if (this.isGameReady === false) {
                if (this.room.players.every((p) => p.ws !== undefined)) {
                    this.isGameReady = true;
                } else {
                    return;
                }
            }
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
            this.broadcastGameState("playing");
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

        // left collsion
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
        const hasWinner = this.players.some(p => p.score >= 5);
        if (hasWinner) {
            this.stop();
            this.broadcastGameState("finished");
            this.players.forEach((p) => {
                const playerTmp = players.get(p.id);
                playerTmp?.ws?.close();
                players.delete(p.id);
        });
        rooms.delete(this.room.id);
        return;
    }

        this.BALL_SPEED += 1;
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
                if (newY >= 0 && newY <= this.CANVA_HEIGHT - player.paddle.height) {
                    player.paddle.y = newY;
                }
            }
        });
    }


    broadcastGameState(state: ("waiting" | "playing" | "finished")): void {
        const gameState = {
            type: "server_state" as const,
            payload: {
                gameStatus: state,
                players: this.players,
                ball: this.ball
            }
        };
        this.room.broadcast(gameState);
    };
}

export default Game;


