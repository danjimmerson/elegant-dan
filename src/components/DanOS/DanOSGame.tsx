import { useEffect, useRef, useState } from "react";
import { Gamepad2 } from "lucide-react";

interface DanOSGameProps {
    onClose: () => void;
}

export const DanOSGame = ({ onClose }: DanOSGameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Use refs for mutable game state to avoid re-renders resetting the game loop
    const gameStateRef = useRef({
        x: 400,
        y: 570,
        dx: 5,
        dy: -5,
        paddleX: 340,
        rightPressed: false,
        leftPressed: false,
        score: 0,
        bricks: [] as { x: number; y: number; status: number; type: number }[][],
        gameRunning: false
    });

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [restartKey, setRestartKey] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Game Constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;
    const PADDLE_HEIGHT = 20;
    const PADDLE_WIDTH = 120;
    const BALL_RADIUS = 8;

    const BRICK_ROW_COUNT = 8;
    const BRICK_COLUMN_COUNT = 10;
    const BRICK_PADDING = 10;
    const BRICK_OFFSET_TOP = 80;
    const BRICK_OFFSET_LEFT = 35;
    const BRICK_WIDTH = 65;
    const BRICK_HEIGHT = 25;

    const BRICK_TYPES = {
        NORMAL: 0,
        COFFEE: 1,
        MONEY: 2,
        CURLING: 3,
        IDEA: 4
    };

    const BRICK_COLORS = ["#333333", "#7C3F00", "#228B22", "#808080", "#FFD700"];
    const BONUS_EMOJIS = ["", "☕️", "💰", "🥌", "💡"];

    // Initialize game state
    const initGame = () => {
        const bricks: { x: number; y: number; status: number; type: number }[][] = [];
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            bricks[c] = [];
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                let type = BRICK_TYPES.NORMAL;
                if (Math.random() < 0.2) {
                    type = Math.floor(Math.random() * 4) + 1;
                }
                bricks[c][r] = { x: 0, y: 0, status: 1, type: type };
            }
        }

        gameStateRef.current = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 30,
            dx: 5,
            dy: -5,
            paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
            rightPressed: false,
            leftPressed: false,
            score: 0,
            bricks: bricks,
            gameRunning: true
        };
        setScore(0);
        setGameOver(false);
        setGameWon(false);
    };

    // Sound Effects
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
    };

    const playSound = (type: "paddle" | "brick" | "wall" | "win" | "lose") => {
        if (!audioCtxRef.current) return;

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case "paddle":
                osc.type = "square";
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case "brick":
                osc.type = "square";
                osc.frequency.setValueAtTime(880, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case "wall":
                osc.type = "sine";
                osc.frequency.setValueAtTime(220, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case "win":
                osc.type = "triangle";
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.linearRampToValueAtTime(880, now + 0.2);
                osc.frequency.linearRampToValueAtTime(1760, now + 0.4);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            case "lose":
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.linearRampToValueAtTime(220, now + 0.3);
                osc.frequency.linearRampToValueAtTime(110, now + 0.6);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
        }
    };

    useEffect(() => {
        if (!gameStarted) return;

        initGame();
        initAudio(); // Initialize audio on game start
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "Right" || e.key === "ArrowRight") gameStateRef.current.rightPressed = true;
            else if (e.key === "Left" || e.key === "ArrowLeft") gameStateRef.current.leftPressed = true;
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            if (e.key === "Right" || e.key === "ArrowRight") gameStateRef.current.rightPressed = false;
            else if (e.key === "Left" || e.key === "ArrowLeft") gameStateRef.current.leftPressed = false;
        };

        const mouseMoveHandler = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < canvas.width) {
                gameStateRef.current.paddleX = relativeX - PADDLE_WIDTH / 2;
            }
        };

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);

        const draw = () => {
            if (!gameStateRef.current.gameRunning) return;

            const state = gameStateRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Bricks
            let activeBricks = 0;
            for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                    if (state.bricks[c][r].status === 1) {
                        activeBricks++;
                        const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                        const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                        state.bricks[c][r].x = brickX;
                        state.bricks[c][r].y = brickY;

                        ctx.beginPath();
                        ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                        ctx.fillStyle = BRICK_COLORS[state.bricks[c][r].type];
                        ctx.fill();
                        ctx.closePath();

                        if (state.bricks[c][r].type !== BRICK_TYPES.NORMAL) {
                            ctx.font = "16px serif";
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillText(BONUS_EMOJIS[state.bricks[c][r].type], brickX + BRICK_WIDTH / 2, brickY + BRICK_HEIGHT / 2);
                        }
                    }
                }
            }

            if (activeBricks === 0) {
                state.gameRunning = false;
                setGameWon(true);
                setGameOver(true);
                playSound("win");
                return;
            }

            // Draw Ball
            ctx.beginPath();
            ctx.arc(state.x, state.y, BALL_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.closePath();

            // Draw Paddle
            ctx.beginPath();
            ctx.rect(state.paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();

            // Draw Avatar on Paddle
            ctx.beginPath();
            ctx.arc(state.paddleX + PADDLE_WIDTH / 2, canvas.height - PADDLE_HEIGHT / 2, 15, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD700";
            ctx.fill();
            ctx.closePath();

            // Collision Detection
            for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                    const b = state.bricks[c][r];
                    if (b.status === 1) {
                        if (
                            state.x > b.x &&
                            state.x < b.x + BRICK_WIDTH &&
                            state.y > b.y &&
                            state.y < b.y + BRICK_HEIGHT
                        ) {
                            state.dy = -state.dy;
                            b.status = 0;
                            const points = b.type === BRICK_TYPES.NORMAL ? 10 : 50;
                            state.score += points;
                            setScore(state.score); // Sync to UI
                            playSound("brick");
                        }
                    }
                }
            }

            // Wall Collision
            if (state.x + state.dx > canvas.width - BALL_RADIUS || state.x + state.dx < BALL_RADIUS) {
                state.dx = -state.dx;
                playSound("wall");
            }
            if (state.y + state.dy < BALL_RADIUS) {
                state.dy = -state.dy;
                playSound("wall");
            } else if (state.y + state.dy > canvas.height - BALL_RADIUS) {
                if (state.x > state.paddleX && state.x < state.paddleX + PADDLE_WIDTH) {
                    // Paddle Hit Logic - add some English based on where it hit
                    state.dy = -state.dy;
                    // Speed up slightly on paddle hit
                    state.dy = state.dy * 1.05;
                    state.dx = state.dx * 1.05;
                    playSound("paddle");
                } else {
                    state.gameRunning = false;
                    setGameOver(true);
                    playSound("lose");
                    return;
                }
            }

            // Paddle Movement
            if (state.rightPressed && state.paddleX < canvas.width - PADDLE_WIDTH) {
                state.paddleX += 7;
            } else if (state.leftPressed && state.paddleX > 0) {
                state.paddleX -= 7;
            }

            state.x += state.dx;
            state.y += state.dy;

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
            document.removeEventListener("mousemove", mouseMoveHandler);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameStarted, restartKey]); // Only re-run if gameStarted changes

    return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white font-mono p-4 relative overflow-hidden">
            <div className="mb-4 flex justify-between w-full max-w-[800px] items-end z-10">
                <div>
                    <h2 className="text-3xl font-bold text-accent tracking-widest">DANPONG</h2>
                    <p className="text-sm text-gray-400">Play me!</p>
                </div>
                <div className="text-2xl font-bold">SCORE: {score}</div>
            </div>

            <div className="relative w-full h-full max-w-[800px] max-h-[600px] border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center bg-gray-900">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="w-full h-full object-contain cursor-none"
                />

                {!gameStarted && !gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-8 text-center z-20">
                        <h3 className="text-4xl font-bold text-accent mb-6">READY PLAYER ONE?</h3>

                        <div className="grid grid-cols-2 gap-8 mb-8 text-left">
                            <div className="space-y-2">
                                <h4 className="font-bold border-b border-gray-600 pb-1">CONTROLS</h4>
                                <p className="text-sm text-gray-300">⬅️ ➡️ Arrow Keys to Move</p>
                                <p className="text-sm text-gray-300">🖱️ Mouse/Touch to Drag</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold border-b border-gray-600 pb-1">GOAL</h4>
                                <p className="text-sm text-gray-300">🧱 Break all bricks</p>
                                <p className="text-sm text-gray-300">💎 Catch falling gems</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setGameStarted(true)}
                            className="px-10 py-5 bg-accent text-white font-bold text-2xl hover:scale-105 transition-transform border-4 border-white shadow-lg animate-pulse"
                        >
                            START GAME
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm gap-6 z-20">
                        <h3 className={`text-5xl font-bold ${gameWon ? "text-green-500" : "text-red-500"}`}>
                            {gameWon ? "YOU WIN!" : "GAME OVER"}
                        </h3>
                        <p className="text-2xl">Final Score: {score}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setRestartKey(prev => prev + 1);
                                    setGameStarted(true);
                                }}
                                className="px-8 py-4 bg-white text-black font-bold text-xl hover:bg-gray-200"
                            >
                                PLAY AGAIN
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-4 bg-red-600 text-white font-bold text-xl hover:bg-red-700 border-2 border-white"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* On-screen Controls */}
            <div className="absolute bottom-20 left-4 right-4 flex justify-between pointer-events-none md:hidden z-30">
                <button
                    className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 active:bg-white/40 pointer-events-auto"
                    onMouseDown={() => { gameStateRef.current.leftPressed = true; }}
                    onMouseUp={() => { gameStateRef.current.leftPressed = false; }}
                    onTouchStart={() => { gameStateRef.current.leftPressed = true; }}
                    onTouchEnd={() => { gameStateRef.current.leftPressed = false; }}
                >
                    <span className="text-3xl">⬅️</span>
                </button>
                <button
                    className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 active:bg-white/40 pointer-events-auto"
                    onMouseDown={() => { gameStateRef.current.rightPressed = true; }}
                    onMouseUp={() => { gameStateRef.current.rightPressed = false; }}
                    onTouchStart={() => { gameStateRef.current.rightPressed = true; }}
                    onTouchEnd={() => { gameStateRef.current.rightPressed = false; }}
                >
                    <span className="text-3xl">➡️</span>
                </button>
            </div>

            <div className="mt-4 text-gray-500 text-xs flex gap-4 flex-wrap justify-center z-10 w-full max-w-[800px]">
                <span>🧱 = Brick (10pts)</span>
                <span>☕️ = Coffee (50pts)</span>
                <span>💰 = Money (50pts)</span>
                <span>🥌 = Curling (50pts)</span>
                <span>💡 = Idea (50pts)</span>
            </div>
        </div>
    );
};
