import { useEffect, useRef, useState } from "react";
import { Gamepad2 } from "lucide-react";

interface DanOSGameProps {
    onClose: () => void;
}

// -- TYPES --
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

interface Point {
    x: number;
    y: number;
}

// -- CONSTANTS --
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 16;
const BALL_SIZE = 12; // Square ball for 8-bit
const BRICK_WIDTH = 64;
const BRICK_HEIGHT = 24;
const BRICK_PADDING = 8;
const BRICK_OFFSET_TOP = 80;
const BRICK_OFFSET_LEFT = 44; // Adjusted to center
const BRICK_ROW_COUNT = 6;
const BRICK_COLUMN_COUNT = 10;

// Palette (Flatirons Inspired)
const COLORS = {
    RUST: "#A63D40",
    FOREST: "#2E5902",
    GOLD: "#E9B44C",
    SLATE: "#4A5859",
    SKY: "#90A9B7",
    WHITE: "#F0F0F0",
    BLACK: "#0F0F0F"
};

const BRICK_TYPES = {
    NORMAL: 0,
    COFFEE: 1,
    MONEY: 2,
    CURLING: 3,
    IDEA: 4
};

const BRICK_COLORS = [
    COLORS.SLATE, // Normal
    "#6F4E37",    // Coffee (Brown)
    COLORS.GOLD,  // Money (Gold)
    "#D1D1D1",    // Curling (Stone)
    "#FFFF00"     // Idea (Yellow)
];

// -- ASSET GENERATION HELPERS --
// Creates a pixel-art texture pattern for bricks/paddle
const createPixelTexture = (primaryColor: string, secondaryColor: string, width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Base
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, width, height);

    // "Noise" / Pixel Texture
    ctx.fillStyle = secondaryColor;
    for (let i = 0; i < width * height * 0.2; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        ctx.fillRect(x, y, 2, 2); // 2x2 pixels for chunky look
    }

    // Border highlight/shadow for 3D effect
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(0, 0, width, 2);
    ctx.fillRect(0, 0, 2, height);

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, height - 2, width, 2);
    ctx.fillRect(width - 2, 0, 2, height);

    return canvas;
};

// Generates an 8-bit icon (e.g., Coffee, Dollar)
const createIconSprite = (type: number): HTMLCanvasElement | null => {
    if (type === BRICK_TYPES.NORMAL) return null;

    const size = 16;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = false; // Ensure pixelated icons

    if (type === BRICK_TYPES.COFFEE) {
        // Simple Cup
        ctx.fillStyle = "#FFF";
        ctx.fillRect(4, 4, 8, 8);
        ctx.fillStyle = "#6F4E37";
        ctx.fillRect(5, 5, 6, 4);
    } else if (type === BRICK_TYPES.MONEY) {
        // Dollar Sign
        ctx.fillStyle = "#116611";
        ctx.font = "bold 14px monospace";
        ctx.fillText("$", 4, 13);
    } else if (type === BRICK_TYPES.CURLING) {
        // Stone
        ctx.fillStyle = "#888";
        ctx.beginPath();
        ctx.arc(8, 9, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#D00";
        ctx.fillRect(6, 4, 4, 3);
    } else if (type === BRICK_TYPES.IDEA) {
        // Bulb
        ctx.fillStyle = "#FF0";
        ctx.beginPath();
        ctx.arc(8, 7, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(6, 11, 4, 3);
    }

    return canvas;
};


export const DanOSGame = ({ onClose }: DanOSGameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Assets Refs
    const spritesRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

    const gameStateRef = useRef({
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - 60,
        dx: 0, // Start stationary
        dy: 0,
        paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
        rightPressed: false,
        leftPressed: false,
        score: 0,
        bricks: [] as { x: number; y: number; status: number; type: number }[][],
        particles: [] as Particle[],
        shake: 0, // Screen shake magnitude
        gameRunning: false, // Waiting for launch
        ballAttached: true, // Ball stuck to paddle at start
    });

    // React State for UI overlays
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStarted, setGameStarted] = useState(false); // Controls "Start Screen"
    const [restartKey, setRestartKey] = useState(0);


    // -- AUDIO SYSTEM --
    const initAudio = () => {
        if (!audioCtxRef.current) {
            // @ts-expect-error: WebkitAudioContext
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
    };

    const playSound = (type: "paddle" | "brick" | "wall" | "win" | "lose" | "launch") => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case "paddle":
                osc.type = "square";
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(300, now + 0.05);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case "brick":
                osc.type = "square";
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1); // "Chirp" down
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            case "wall":
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(100, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case "launch":
                osc.type = "triangle";
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case "lose":
                // Sad slide
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.5);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case "win":
                // Victory Arpeggio
                const scale = [440, 554, 659, 880];
                scale.forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.type = "square";
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(0.1, now + i * 0.1);
                    g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
                    o.start(now + i * 0.1);
                    o.stop(now + i * 0.1 + 0.3);
                });
                break;
        }
    };

    // -- GENERATE WORLD --
    useEffect(() => {
        // Generate Sprites once
        if (spritesRef.current.size === 0) {
            spritesRef.current.set('paddle', createPixelTexture(COLORS.SKY, "#FFFFFF", PADDLE_WIDTH, PADDLE_HEIGHT));
            // Generate brick textures for each type
            BRICK_COLORS.forEach((color, idx) => {
                spritesRef.current.set(`brick_${idx}`, createPixelTexture(color, "rgba(255,255,255,0.2)", BRICK_WIDTH, BRICK_HEIGHT));
            });
            // Generate icons
            [BRICK_TYPES.COFFEE, BRICK_TYPES.MONEY, BRICK_TYPES.CURLING, BRICK_TYPES.IDEA].forEach(type => {
                const icon = createIconSprite(type);
                if (icon) spritesRef.current.set(`icon_${type}`, icon);
            });
        }
    }, []);

    // -- GAME LOOP --
    useEffect(() => {
        if (!gameStarted) return;

        // Reset Logic
        const resetBricks = () => {
            const b = [];
            for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                b[c] = [];
                for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                    let type = BRICK_TYPES.NORMAL;
                    // Rare bricks logic
                    const rand = Math.random();
                    if (rand < 0.05) type = BRICK_TYPES.IDEA;
                    else if (rand < 0.10) type = BRICK_TYPES.MONEY;
                    else if (rand < 0.15) type = BRICK_TYPES.COFFEE;
                    else if (rand < 0.20) type = BRICK_TYPES.CURLING;

                    b[c][r] = { x: 0, y: 0, status: 1, type: type };
                }
            }
            return b;
        };

        gameStateRef.current = {
            ...gameStateRef.current,
            bricks: resetBricks(),
            score: 0,
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE - 2, // Position ball on paddle
            dx: 0,
            dy: 0,
            ballAttached: true,
            gameRunning: true,
            shake: 0,
            particles: []
        };
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        initAudio();

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false }); // Optimize for no transparency on main canvas
        if (!ctx) return;

        // Disable smoothing for pixel art look
        ctx.imageSmoothingEnabled = false;

        let animationFrameId: number;

        // Inputs
        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "Right" || e.key === "ArrowRight") gameStateRef.current.rightPressed = true;
            else if (e.key === "Left" || e.key === "ArrowLeft") gameStateRef.current.leftPressed = true;
            else if (e.code === "Space") {
                if (gameStateRef.current.ballAttached) {
                    gameStateRef.current.ballAttached = false;
                    gameStateRef.current.dy = -6; // Launch speed
                    gameStateRef.current.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
                    playSound("launch");
                }
            }
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            if (e.key === "Right" || e.key === "ArrowRight") gameStateRef.current.rightPressed = false;
            else if (e.key === "Left" || e.key === "ArrowLeft") gameStateRef.current.leftPressed = false;
        };

        const mouseMoveHandler = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const scaleX = canvas.width / rect.width;
            const canvasX = relativeX * scaleX;

            if (canvasX > 0 && canvasX < canvas.width) {
                gameStateRef.current.paddleX = canvasX - PADDLE_WIDTH / 2;
            }
        };

        // Launch on click too
        const mouseClickHandler = () => {
            if (gameStateRef.current.ballAttached) {
                gameStateRef.current.ballAttached = false;
                gameStateRef.current.dy = -6;
                gameStateRef.current.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
                playSound("launch");
            }
        };

        const touchMoveHandler = (e: TouchEvent) => {
            e.preventDefault(); // Prevent scrolling
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const relativeX = touch.clientX - rect.left;
            const scaleX = canvas.width / rect.width;
            const canvasX = relativeX * scaleX;

            if (canvasX > 0 && canvasX < canvas.width) {
                gameStateRef.current.paddleX = canvasX - PADDLE_WIDTH / 2;
            }
        };

        const touchStartHandler = (e: TouchEvent) => {
            // If ball is attached, launch it.
            // If not, maybe we could use tapping on sides to move? 
            // But touchmove is better for paddle control.
            // Just use tap for launch.
            if (gameStateRef.current.ballAttached) {
                gameStateRef.current.ballAttached = false;
                gameStateRef.current.dy = -6;
                gameStateRef.current.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
                playSound("launch");
            }
        };

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mousedown", mouseClickHandler);
        // Add passive: false to allow preventDefault
        canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });
        canvas.addEventListener("touchstart", touchStartHandler, { passive: false });

        // -- UPDATE & DRAW --
        const loop = () => {
            if (!gameStateRef.current.gameRunning) {
                // If game is not running, but we are still in the loop (e.g. after win/lose),
                // we should still draw the final state once.
                // Then, we can cancel the animation frame.
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                return;
            }
            const state = gameStateRef.current;

            // Apply Screen Shake transform
            ctx.save();
            if (state.shake > 0) {
                const shakeX = (Math.random() - 0.5) * state.shake;
                const shakeY = (Math.random() - 0.5) * state.shake;
                ctx.translate(shakeX, shakeY);
                state.shake *= 0.9; // Decay
                if (state.shake < 0.5) state.shake = 0;
            }

            // Clear Background
            ctx.fillStyle = COLORS.BLACK;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Replaces clearRect for solid BG

            // Draw Bricks
            let activeBricks = 0;
            for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                    const b = state.bricks[c][r];
                    if (b.status === 1) {
                        activeBricks++;
                        const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                        const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                        b.x = brickX;
                        b.y = brickY;

                        // Draw Sprite
                        const sprite = spritesRef.current.get(`brick_${b.type}`);
                        if (sprite) {
                            ctx.drawImage(sprite, brickX, brickY);
                        } else {
                            // Fallback
                            ctx.fillStyle = BRICK_COLORS[0];
                            ctx.fillRect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                        }

                        // Draw Icon
                        const icon = spritesRef.current.get(`icon_${b.type}`);
                        if (icon) {
                            ctx.drawImage(icon, brickX + (BRICK_WIDTH - 16) / 2, brickY + (BRICK_HEIGHT - 16) / 2);
                        }
                    }
                }
            }

            if (activeBricks === 0) {
                state.gameRunning = false;
                setGameWon(true);
                setGameOver(true);
                playSound("win");
                ctx.restore();
                return;
            }

            // Paddle Movement
            if (state.rightPressed && state.paddleX < CANVAS_WIDTH - PADDLE_WIDTH) {
                state.paddleX += 8;
            } else if (state.leftPressed && state.paddleX > 0) {
                state.paddleX -= 8;
            }

            // Ball Movement Logic
            if (state.ballAttached) {
                state.x = state.paddleX + PADDLE_WIDTH / 2 - BALL_SIZE / 2;
                state.y = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE - 2;
            } else {
                state.x += state.dx;
                state.y += state.dy;

                // Wall Collision
                if (state.x + state.dx > CANVAS_WIDTH - BALL_SIZE || state.x + state.dx < 0) {
                    state.dx = -state.dx;
                    playSound("wall");
                }
                if (state.y + state.dy < 0) {
                    state.dy = -state.dy;
                    playSound("wall");
                } else if (state.y + state.dy > CANVAS_HEIGHT - BALL_SIZE) {
                    // Dead
                    state.gameRunning = false;
                    setGameOver(true);
                    playSound("lose");
                    ctx.restore();
                    return;
                }

                // Paddle Collision
                if (
                    state.y + BALL_SIZE >= CANVAS_HEIGHT - PADDLE_HEIGHT && // At paddle height
                    state.x + BALL_SIZE >= state.paddleX && // within left edge
                    state.x <= state.paddleX + PADDLE_WIDTH // within right edge
                ) {
                    state.dy = -state.dy;
                    // "English" (Spin/Angle Control)
                    // Calculate where on the paddle it hit (-1.0 to 1.0)
                    const hitPoint = (state.x + BALL_SIZE / 2) - (state.paddleX + PADDLE_WIDTH / 2);
                    const normalizedHit = hitPoint / (PADDLE_WIDTH / 2);

                    state.dx = normalizedHit * 8; // Max horizontal speed 8

                    // Add shake
                    state.shake = 5;
                    playSound("paddle");
                }

                // Brick Collision
                for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                    for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                        const b = state.bricks[c][r];
                        if (b.status === 1) {
                            if (
                                state.x + BALL_SIZE > b.x &&
                                state.x < b.x + BRICK_WIDTH &&
                                state.y + BALL_SIZE > b.y &&
                                state.y < b.y + BRICK_HEIGHT
                            ) {
                                state.dy = -state.dy;
                                b.status = 0;

                                // Score
                                let points = 10;
                                if (b.type !== BRICK_TYPES.NORMAL) points = 50;
                                state.score += points;
                                setScore(state.score);

                                playSound("brick");

                                // Particles
                                const color = BRICK_COLORS[b.type];
                                for (let i = 0; i < 8; i++) {
                                    state.particles.push({
                                        x: b.x + BRICK_WIDTH / 2,
                                        y: b.y + BRICK_HEIGHT / 2,
                                        vx: (Math.random() - 0.5) * 8,
                                        vy: (Math.random() - 0.5) * 8,
                                        life: 1.0,
                                        color: color,
                                        size: Math.random() * 4 + 2
                                    });
                                }

                                if (b.type === BRICK_TYPES.MONEY || b.type === BRICK_TYPES.IDEA) {
                                    state.shake = 10; // Big shake for special bricks
                                }
                            }
                        }
                    }
                }
            }

            // Draw Paddle
            const paddleSprite = spritesRef.current.get('paddle');
            if (paddleSprite) {
                ctx.drawImage(paddleSprite, state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT);
            } else {
                ctx.fillStyle = COLORS.SKY;
                ctx.fillRect(state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
            }

            // Draw Ball (Pixel Square)
            ctx.fillStyle = COLORS.WHITE;
            ctx.fillRect(state.x, state.y, BALL_SIZE, BALL_SIZE);

            // Draw Particles
            for (let i = state.particles.length - 1; i >= 0; i--) {
                const p = state.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // Gravity
                p.life -= 0.02;

                if (p.life <= 0) {
                    state.particles.splice(i, 1);
                } else {
                    ctx.fillStyle = p.color;
                    // Pixel particles
                    const pSize = Math.max(1, p.size * p.life);
                    ctx.fillRect(p.x, p.y, pSize, pSize);
                }
            }

            ctx.restore();
            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mousedown", mouseClickHandler);
            if (canvas) {
                canvas.removeEventListener("touchmove", touchMoveHandler);
                canvas.removeEventListener("touchstart", touchStartHandler);
            }
            cancelAnimationFrame(animationFrameId);
        };

    }, [gameStarted, restartKey]);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#1a1a1a] text-white font-mono p-4 relative overflow-hidden select-none">
            {/* Header */}
            <div className="mb-4 flex justify-between w-full max-w-[800px] items-end z-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-widest text-[#E9B44C] drop-shadow-md">DANPONG</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">RETRO EDITION v1.0</p>
                </div>
                <div className="text-3xl font-bold font-mono text-white drop-shadow-md">{score.toString().padStart(5, '0')}</div>
            </div>

            {/* Game Container */}
            <div className="relative w-full h-full max-w-[800px] max-h-[600px] border-[4px] border-[#4A5859] shadow-2xl flex items-center justify-center bg-black rounded-sm overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="w-full h-full object-contain cursor-none"
                    style={{ imageRendering: 'pixelated' }}
                />

                {/* START SCREEN */}
                {!gameStarted && !gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-8 text-center z-20">
                        <Gamepad2 className="w-20 h-20 text-[#E9B44C] mb-6 animate-pulse" />
                        <h3 className="text-5xl font-bold text-white mb-4 tracking-tighter">
                            INSERT COIN
                        </h3>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Smash bricks, collect coffee & ideas. Don't drop the ball.
                        </p>

                        <button
                            onClick={() => setGameStarted(true)}
                            className="px-12 py-4 bg-[#A63D40] hover:bg-[#802D30] text-white font-bold text-xl uppercase tracking-widest transition-transform hover:scale-105 border-b-4 border-[#501D20] active:border-b-0 active:translate-y-1"
                        >
                            Start Game
                        </button>
                    </div>
                )}

                {/* GAME OVER SCREEN */}
                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md gap-6 z-20">
                        <h3 className={`text-6xl font-bold ${gameWon ? "text-[#2E5902]" : "text-[#A63D40]"}`}>
                            {gameWon ? "COMPLETE!" : "GAME OVER"}
                        </h3>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 uppercase">Final Score</p>
                            <p className="text-4xl font-mono text-white">{score}</p>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => {
                                    setRestartKey(prev => prev + 1);
                                    setGameStarted(true);
                                }}
                                className="px-8 py-3 bg-white text-black font-bold text-lg uppercase tracking-wider hover:bg-gray-200 transition-colors border-b-4 border-gray-400 active:border-b-0 active:translate-y-1"
                            >
                                Retry
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-[#4A5859] text-white font-bold text-lg uppercase tracking-wider hover:bg-[#3A4849] transition-colors border-b-4 border-[#2A3839] active:border-b-0 active:translate-y-1"
                            >
                                Quit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Controls Hint */}
            <div className="absolute bottom-6 text-gray-500 text-xs md:hidden">
                Tap left/right to move • Tap game to launch
            </div>
        </div>
    );
};
