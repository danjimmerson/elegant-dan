import { useEffect, useRef, useState } from "react";
import { Gamepad2, Trophy, Zap, ListOrdered, X, Maximize2, Minimize2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import danpongLogo from "@/assets/danpong_logo.png";
import brandLogo from "@/assets/dan-jimmerson-logo.svg";

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

interface PowerUp {
    x: number;
    y: number;
    type: 'WIDE' | 'MULTI';
    active: boolean;
}

interface HighScore {
    name: string;
    score: number;
    level: number;
}

// -- CONSTANTS --
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_HEIGHT = 16;
const BALL_SIZE = 12;
const BRICK_WIDTH = 64;
const BRICK_HEIGHT = 32;
const BRICK_PADDING = 8;
const BRICK_OFFSET_TOP = 110;
const BRICK_OFFSET_LEFT = 44;
const BRICK_ROW_COUNT = 6;
const BRICK_COLUMN_COUNT = 10;

const LEVELS = [
    { name: "THE FLATIRONS", theme: "colorado" },
    { name: "DAILY GRIND", theme: "coffee" },
    { name: "THE SHEET", theme: "curling" },
    { name: "THE FUNNEL", theme: "marketing" },
    { name: "GOLDEN HOUR", theme: "gold" }
];

const COLORS = {
    colorado: { bg: "#1a2c38", paddle: "#78A1BB", ball: "#E9F1F7", primary: "#2E5902", secondary: "#A63D40", text: "#E9B44C" },
    coffee: { bg: "#2b211e", paddle: "#D4A574", ball: "#FFF", primary: "#6F4E37", secondary: "#3C2A20", text: "#D4A574" },
    curling: { bg: "#eef2f5", paddle: "#005EB8", ball: "#333", primary: "#005EB8", secondary: "#D00", text: "#000" },
    marketing: { bg: "#0F172A", paddle: "#3B82F6", ball: "#F472B6", primary: "#3B82F6", secondary: "#EC4899", text: "#F472B6" },
    gold: { bg: "#2a2208", paddle: "#FFD700", ball: "#FFF", primary: "#FFD700", secondary: "#DAA520", text: "#FFD700" }
};

const BRICK_TYPES = {
    NORMAL: 0,
    SPECIAL: 1,
    POWERUP: 3
};

export const DanOSGame = ({ onClose }: DanOSGameProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // UI State
    const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'GAMEOVER' | 'HIGHSCORE' | 'LEADERBOARD' | 'INSTRUCTIONS'>('MENU');


    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScores, setHighScores] = useState<HighScore[]>([]);
    const [initials, setInitials] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);

    const spritesRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

    // Mutable Game State
    const gameRef = useRef({
        x: 0, y: 0, dx: 0, dy: 0,
        paddleX: 0,
        paddleWidth: 100,
        rightPressed: false, leftPressed: false,
        bricks: [] as any[],
        particles: [] as Particle[],
        powerUps: [] as PowerUp[],
        shake: 0,
        ballAttached: true,
        lastTime: 0 // DELTA TIME
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Layout Cache Ref to prevent thrashing
    const rectRef = useRef<DOMRect | null>(null);

    const updateRect = () => {
        if (canvasRef.current) {
            rectRef.current = canvasRef.current.getBoundingClientRect();
        }
    };

    useEffect(() => {
        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect);
        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Auto-resume audio on interaction
    useEffect(() => {
        const resumeAudio = () => {
            if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
                audioCtxRef.current.resume();
            }
        };
        document.addEventListener('click', resumeAudio);
        return () => document.removeEventListener('click', resumeAudio);
    }, []);

    const generateAssets = (themeKey: string) => {
        const theme = COLORS[themeKey as keyof typeof COLORS];
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) return;

        const bake = (w: number, h: number, drawFn: (c: CanvasRenderingContext2D) => void) => {
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            const cx = c.getContext('2d');
            if (cx) drawFn(cx);
            return c;
        };

        spritesRef.current.set('paddle', bake(200, PADDLE_HEIGHT, (c) => {
            c.fillStyle = theme.paddle;
            c.fillRect(0, 0, 200, PADDLE_HEIGHT);
            c.fillStyle = "rgba(255,255,255,0.3)";
            c.fillRect(0, 0, 200, 4);
        }));

        spritesRef.current.set('brick_normal', bake(BRICK_WIDTH, BRICK_HEIGHT, (c) => {
            c.fillStyle = theme.primary;
            c.fillRect(0, 0, BRICK_WIDTH, BRICK_HEIGHT);

            if (themeKey === 'colorado') {
                c.fillStyle = "#1a330a";
                c.beginPath(); c.moveTo(10, 24); c.lineTo(16, 10); c.lineTo(22, 24); c.fill();
                c.beginPath(); c.moveTo(40, 24); c.lineTo(46, 10); c.lineTo(52, 24); c.fill();
            } else if (themeKey === 'coffee') {
                c.strokeStyle = "#4ea";
                c.globalCompositeOperation = 'multiply';
                c.fillStyle = "#000"; c.globalAlpha = 0.2;
                c.beginPath(); c.arc(32, 12, 8, 0, Math.PI * 2); c.fill();
            }
            c.globalAlpha = 1;
            c.globalCompositeOperation = 'source-over';
            c.fillStyle = "rgba(255,255,255,0.2)";
            c.fillRect(0, 0, BRICK_WIDTH, 2); c.fillRect(0, 0, 2, BRICK_HEIGHT);
            c.fillStyle = "rgba(0,0,0,0.3)";
            c.fillRect(0, BRICK_HEIGHT - 2, BRICK_WIDTH, 2); c.fillRect(BRICK_WIDTH - 2, 0, 2, BRICK_HEIGHT);
        }));

        spritesRef.current.set('brick_special', bake(BRICK_WIDTH, BRICK_HEIGHT, (c) => {
            c.fillStyle = theme.secondary;
            c.fillRect(0, 0, BRICK_WIDTH, BRICK_HEIGHT);

            if (themeKey === 'colorado') {
                c.fillStyle = "#FFF";
                c.beginPath(); c.moveTo(0, 0); c.lineTo(BRICK_WIDTH, 0); c.lineTo(BRICK_WIDTH, 12);
                c.lineTo(48, 6); c.lineTo(32, 14); c.lineTo(16, 6); c.lineTo(0, 12); c.fill();
            } else if (themeKey === 'curling') {
                c.strokeStyle = "#FFF"; c.lineWidth = 2;
                c.beginPath(); c.arc(32, 12, 8, 0, Math.PI * 2); c.stroke();
            }
            c.fillStyle = "rgba(255,255,255,0.3)";
            c.fillRect(0, 0, BRICK_WIDTH, 2); c.fillRect(0, 0, 2, BRICK_HEIGHT);
            c.fillStyle = "rgba(0,0,0,0.4)";
            c.fillRect(0, BRICK_HEIGHT - 2, BRICK_WIDTH, 2); c.fillRect(BRICK_WIDTH - 2, 0, 2, BRICK_HEIGHT);
        }));

        spritesRef.current.set('brick_powerup', bake(BRICK_WIDTH, BRICK_HEIGHT, (c) => {
            c.fillStyle = "#FFD700";
            c.fillRect(0, 0, BRICK_WIDTH, BRICK_HEIGHT);
            c.fillStyle = "#000";
            c.font = "bold 20px monospace";
            c.textAlign = "center";
            c.fillText("?", BRICK_WIDTH / 2, BRICK_HEIGHT / 2 + 7);
            c.strokeStyle = "#FFF"; c.lineWidth = 2;
            c.strokeRect(2, 2, BRICK_WIDTH - 4, BRICK_HEIGHT - 4);
        }));
    };

    const getAudioCtx = () => {
        if (!audioCtxRef.current) {
            // @ts-expect-error: Webkit compatibility
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtxRef.current;
    };

    const playSound = (type: string) => {
        try {
            const ctx = getAudioCtx();
            if (ctx.state === "suspended") ctx.resume();

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'hit') {
                osc.frequency.setValueAtTime(400 + Math.random() * 200, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
            } else if (type === 'paddle') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
            } else if (type === 'powerup') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now); osc.stop(now + 0.3);
            } else if (type === 'die') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.5);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now); osc.stop(now + 0.5);
            } else if (type === 'win') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554, now + 0.1);
                osc.frequency.setValueAtTime(659, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);
                osc.start(now); osc.stop(now + 0.6);
            }
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    const loadLevel = (levelIdx: number) => {
        const themeKey = LEVELS[levelIdx % LEVELS.length].theme;
        generateAssets(themeKey);

        const newBricks = [];
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            newBricks[c] = [];
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                let type = BRICK_TYPES.NORMAL;
                let active = 1;

                if (themeKey === 'colorado') {
                    if (r < 2 && (c < 2 || c > 7)) active = 0;
                    if (r === 0 && active) type = BRICK_TYPES.SPECIAL;
                } else if (themeKey === 'marketing') {
                    if (r > c && r > (BRICK_COLUMN_COUNT - 1 - c)) active = 0;
                    if (r === 5) type = BRICK_TYPES.SPECIAL;
                } else if (themeKey === 'curling') {
                    if ((c >= 3 && c <= 6) && (r >= 1 && r <= 4)) type = BRICK_TYPES.SPECIAL;
                    else if ((c >= 2 && c <= 7) && (r >= 0 && r <= 5)) type = BRICK_TYPES.NORMAL;
                    else active = 0;
                }

                if (active && Math.random() < 0.05) type = BRICK_TYPES.POWERUP;
                newBricks[c][r] = { x: 0, y: 0, status: active, type };
            }
        }

        gameRef.current.bricks = newBricks;
        gameRef.current.ballAttached = true;
        gameRef.current.x = CANVAS_WIDTH / 2;
        gameRef.current.y = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE - 2;
        gameRef.current.dx = 0;
        gameRef.current.dy = 0;
        gameRef.current.paddleX = (CANVAS_WIDTH - 100) / 2;
        gameRef.current.paddleWidth = 100;
        gameRef.current.particles = [];
        gameRef.current.powerUps = [];
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setCurrentLevel(0);
        loadLevel(0);
        setGameState('PLAYING');
        try { if (audioCtxRef.current) audioCtxRef.current.resume(); } catch { }
    };

    // Global Key Listener for Start
    useEffect(() => {
        if (gameState === 'MENU') {
            const handleStartKey = (e: KeyboardEvent) => {
                if (e.code === 'Space' || e.key === 'Enter') startGame();
            };
            window.addEventListener('keydown', handleStartKey);
            return () => window.removeEventListener('keydown', handleStartKey);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'PLAYING') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false;
        let animationId: number;

        const levelData = LEVELS[currentLevel % LEVELS.length];
        const theme = COLORS[levelData.theme as keyof typeof COLORS] || COLORS.colorado;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') gameRef.current.rightPressed = true;
            if (e.key === 'ArrowLeft') gameRef.current.leftPressed = true;
            if (e.code === 'Space' && gameRef.current.ballAttached) {
                gameRef.current.ballAttached = false;
                gameRef.current.dy = -6;
                gameRef.current.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
                playSound('hit');
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') gameRef.current.rightPressed = false;
            if (e.key === 'ArrowLeft') gameRef.current.leftPressed = false;
        };

        const handleInput = (clientX: number) => {
            if (!canvas) return;
            // PERFORMANCE: Use cached rect if available to prevent layout thrashing
            const rect = rectRef.current || canvas.getBoundingClientRect();
            const scaleX = CANVAS_WIDTH / rect.width;
            const relativeX = (clientX - rect.left) * scaleX;

            const PWIDTH = gameRef.current.paddleWidth;
            let newPaddleX = relativeX - PWIDTH / 2;

            if (newPaddleX < 0) newPaddleX = 0;
            if (newPaddleX > CANVAS_WIDTH - PWIDTH) newPaddleX = CANVAS_WIDTH - PWIDTH;

            gameRef.current.paddleX = newPaddleX;
        };

        const handleMouseMove = (e: MouseEvent) => {
            handleInput(e.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.cancelable) e.preventDefault();
            if (e.touches.length > 0) {
                handleInput(e.touches[0].clientX);
            }
        };

        const handleLaunch = () => {
            if (gameRef.current.ballAttached) {
                gameRef.current.ballAttached = false;
                gameRef.current.dy = -6;
                gameRef.current.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
                playSound('hit');
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            // Optional: Handle immediate move on start
            if (e.touches.length > 0) {
                handleInput(e.touches[0].clientX);
            }
            handleLaunch();
        };

        const update = (timestamp: number) => {
            const state = gameRef.current;

            // DELTA TIME CALCULATION
            if (!state.lastTime) state.lastTime = timestamp;
            const deltaTime = Math.min((timestamp - state.lastTime) / 16.667, 3); // Cap at 3x speed to prevent teleporting
            state.lastTime = timestamp;

            const PWIDTH = state.paddleWidth;

            ctx.fillStyle = theme.bg;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            ctx.save();
            if (state.shake > 0) {
                ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
                state.shake *= 0.9;
                if (state.shake < 0.5) state.shake = 0;
            }

            // USE DELTA TIME FOR MOVEMENT
            const paddleSpeed = 7 * deltaTime;
            if (state.rightPressed && state.paddleX < CANVAS_WIDTH - PWIDTH) state.paddleX += paddleSpeed;
            if (state.leftPressed && state.paddleX > 0) state.paddleX -= paddleSpeed;

            if (!state.ballAttached) {
                // MOVE BY DELTA
                state.x += state.dx * deltaTime;
                state.y += state.dy * deltaTime;

                if (state.x + state.dx * deltaTime > CANVAS_WIDTH - BALL_SIZE || state.x + state.dx * deltaTime < 0) {
                    state.dx = -state.dx; playSound('hit');
                }
                if (state.y + state.dy * deltaTime < 0) {
                    state.dy = -state.dy; playSound('hit');
                } else if (state.y + state.dy * deltaTime > CANVAS_HEIGHT - BALL_SIZE) {
                    setLives(prev => {
                        const newLives = prev - 1;
                        if (newLives <= 0) {
                            setGameState('GAMEOVER');
                            playSound('die');
                        } else {
                            state.ballAttached = true;
                            state.paddleWidth = 100;
                            playSound('die');
                        }
                        return newLives;
                    });
                }

                if (state.y + BALL_SIZE >= CANVAS_HEIGHT - PADDLE_HEIGHT &&
                    state.x + BALL_SIZE >= state.paddleX &&
                    state.x <= state.paddleX + PWIDTH) {
                    state.dy = -Math.abs(state.dy);
                    const hitPoint = (state.x + BALL_SIZE / 2) - (state.paddleX + PWIDTH / 2);
                    state.dx = hitPoint * 0.15;
                    state.shake = 5;
                    playSound('paddle');
                }

                let activeBricks = 0;
                if (state.bricks && state.bricks.length > 0) {
                    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                            const b = state.bricks[c]?.[r];
                            if (b && b.status === 1) {
                                activeBricks++;
                                const bX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                                const bY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;

                                if (state.x + BALL_SIZE > bX && state.x < bX + BRICK_WIDTH &&
                                    state.y + BALL_SIZE > bY && state.y < bY + BRICK_HEIGHT) {
                                    state.dy = -state.dy;
                                    b.status = 0;
                                    setScore(s => s + (b.type === BRICK_TYPES.SPECIAL ? 50 : 10));
                                    playSound('hit');
                                    state.shake = 3;

                                    if (b.type === BRICK_TYPES.POWERUP) {
                                        state.powerUps.push({
                                            x: bX + BRICK_WIDTH / 2,
                                            y: bY,
                                            type: 'WIDE',
                                            active: true
                                        });
                                        playSound('powerup');
                                    }

                                    const pColor = b.type === BRICK_TYPES.SPECIAL ? theme.secondary : theme.primary;
                                    const particleCount = isMobile ? 0 : 8; // DISABLED PARTICLES ON MOBILE COMPLETELY
                                    for (let i = 0; i < particleCount; i++) {
                                        state.particles.push({
                                            x: bX + BRICK_WIDTH / 2, y: bY + BRICK_HEIGHT / 2,
                                            vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
                                            life: 1, color: pColor, size: Math.random() * 6 + 2
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                if (activeBricks === 0 && state.bricks.length > 0) {
                    playSound('win');
                    if (currentLevel < LEVELS.length - 1) {
                        setCurrentLevel(prev => prev + 1);
                        loadLevel(currentLevel + 1);
                    } else {
                        setCurrentLevel(0);
                        loadLevel(0);
                    }
                }

            } else {
                state.x = state.paddleX + PWIDTH / 2 - BALL_SIZE / 2;
                state.y = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE - 2;
            }

            for (let i = state.powerUps.length - 1; i >= 0; i--) {
                const pup = state.powerUps[i];
                if (pup.active) {
                    pup.y += 3 * deltaTime;
                    if (pup.y > CANVAS_HEIGHT - PADDLE_HEIGHT - 20 &&
                        pup.y < CANVAS_HEIGHT &&
                        pup.x > state.paddleX &&
                        pup.x < state.paddleX + PWIDTH) {
                        state.paddleWidth = Math.min(200, state.paddleWidth + 50);
                        setScore(s => s + 100);
                        playSound('powerup');
                        pup.active = false;
                        state.powerUps.splice(i, 1);
                    }
                    if (pup.y > CANVAS_HEIGHT) state.powerUps.splice(i, 1);
                }
            }

            const getSprite = (k: string) => spritesRef.current.get(k);

            state.bricks.forEach((col: any[], c: number) => {
                col.forEach((b: any, r: number) => {
                    if (b.status === 1) {
                        const bX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                        const bY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                        let sKey = 'brick_normal';
                        if (b.type === BRICK_TYPES.SPECIAL) sKey = 'brick_special';
                        if (b.type === BRICK_TYPES.POWERUP) sKey = 'brick_powerup';
                        const img = getSprite(sKey);
                        if (img) ctx.drawImage(img, bX, bY);
                        else {
                            ctx.fillStyle = theme.primary;
                            ctx.fillRect(bX, bY, BRICK_WIDTH, BRICK_HEIGHT);
                        }
                    }
                });
            });

            const pImg = getSprite('paddle');
            if (pImg) {
                ctx.drawImage(pImg, 0, 0, 200, PADDLE_HEIGHT, state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, PWIDTH, PADDLE_HEIGHT);
            } else {
                ctx.fillStyle = theme.paddle;
                ctx.fillRect(state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, PWIDTH, PADDLE_HEIGHT);
            }

            ctx.fillStyle = theme.ball;
            ctx.fillRect(state.x, state.y, BALL_SIZE, BALL_SIZE);

            state.powerUps.forEach(pup => {
                ctx.fillStyle = "#FFd700";
                ctx.beginPath();
                ctx.arc(pup.x, pup.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#000";
                ctx.font = "10px monospace";
                ctx.fillText("W", pup.x - 4, pup.y + 4);
            });

            for (let i = state.particles.length - 1; i >= 0; i--) {
                const p = state.particles[i];
                p.x += p.vx * deltaTime; p.y += p.vy * deltaTime; p.life -= 0.02 * deltaTime;
                if (p.life <= 0) state.particles.splice(i, 1);
                else {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                    ctx.globalAlpha = 1;
                }
            }

            ctx.restore();
            animationId = requestAnimationFrame(update);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleLaunch);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });

        animationId = requestAnimationFrame(update);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleLaunch);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchstart', handleTouchStart);
            cancelAnimationFrame(animationId);
        };
    }, [gameState, currentLevel, isMobile]); // Added isMobile to dependency

    useEffect(() => {
        if (gameState === 'GAMEOVER' || gameState === 'LEADERBOARD') {
            const fetchScores = async () => {
                const { data } = await supabase.from('high_scores').select('*').order('score', { ascending: false }).limit(10);
                if (data) setHighScores(data);
            };
            fetchScores();
        }
    }, [gameState]);

    const submitScore = async () => {
        if (!initials) return;
        await supabase.from('high_scores').insert({
            name: initials.toUpperCase(),
            score: score,
            level: currentLevel + 1
        });
        toast.success("Score Submitted!");
        setGameState('LEADERBOARD'); // Go to leaderboard after submit
    };

    const currentTheme = COLORS[LEVELS[currentLevel % LEVELS.length].theme as keyof typeof COLORS];
    const isMobilePlaying = isMobile && gameState === 'PLAYING';

    const [showRotatePrompt, setShowRotatePrompt] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            if (isMobile && window.innerHeight > window.innerWidth) {
                setShowRotatePrompt(true);
            } else {
                setShowRotatePrompt(false);
            }
        };
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, [isMobile]);

    if (showRotatePrompt) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-center p-8">
                <div className="animate-spin mb-8">
                    <Maximize2 className="w-16 h-16 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">Please Rotate Device</h2>
                <p className="text-gray-400">DanPong requires landscape mode for optimal performance.</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`flex flex-col items-center justify-center p-4 bg-[#0a0a0a] text-white font-mono relative select-none transition-all duration-300 ${isFullscreen ? 'w-full h-full' : ''} ${isMobilePlaying ? 'fixed top-0 left-0 z-[100] w-full h-[100dvh] bg-black justify-center' : 'w-full h-full md:w-auto md:h-full'}`}>
            {/* Mobile Exit Button */}
            {isMobilePlaying && (
                <button
                    onClick={() => setGameState('MENU')}
                    className="absolute top-4 right-4 z-[110] bg-red-600/80 text-white p-2 text-xs font-bold rounded border border-white/20 backdrop-blur-md uppercase tracking-widest"
                >
                    Exit Game
                </button>
            )}

            {/* VINTAGE CRT OVERLAY - Disabled on mobile for performance */}
            {!isMobile && (
                <>
                    <div className={`absolute inset-0 z-50 pointer-events-none crt-overlay mix-blend-overlay ${isFullscreen ? 'opacity-20' : 'opacity-30'}`}></div>
                    <div className={`absolute inset-0 z-50 pointer-events-none crt-scanline ${isFullscreen ? 'opacity-5' : 'opacity-10'}`}></div>
                </>
            )}

            <div className={`flex justify-between w-full max-w-[800px] mb-4 text-[#E9B44C] items-center uppercase tracking-widest z-10 font-bold px-2 md:px-0 ${isMobilePlaying ? 'pt-8' : ''}`}>
                {/* BRAND & LEVEL INFO */}
                <div className="flex items-center gap-4 md:gap-6">
                    <img src={brandLogo} alt="Dan Jimmerson" className="h-6 md:h-10 w-auto text-glow" />
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-blue-300 opacity-80">CURRENT LEVEL</span>
                        <span className="text-sm md:text-lg text-glow text-white tracking-tighter shadow-blue-500/50">{LEVELS[currentLevel % LEVELS.length].name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="text-right">
                        <div className="text-[10px] md:text-xs text-blue-300 opacity-80">SCORE</div>
                        <div className="text-xl md:text-3xl text-glow leading-none">{score.toString().padStart(6, '0')}</div>
                    </div>
                    {/* FULLSCREEN TOGGLE */}
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded transition-colors text-blue-400">
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                    {/* CLOSE BUTTON (Only visible if not fullscreen usually, but good to keep) */}
                    {!isFullscreen && (
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded transition-colors text-red-500">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className={`relative bg-black border-[2px] md:border-[4px] border-[#333] shadow-[0_0_15px_rgba(0,0,0,0.9)] md:shadow-[0_0_30px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden ring-1 ring-white/10 ${isFullscreen ? 'h-[80vh] aspect-[4/3]' : (isMobilePlaying ? 'w-full h-auto aspect-[4/3]' : 'w-full max-w-[800px] aspect-[4/3] h-auto')}`}>
                {/* Canvas keeps internal resolution but scales via CSS */}
                <canvas ref={canvasRef} width={800} height={600} className="w-full h-full block rendering-pixelated" />

                {/* MENU OVERLAY */}
                {gameState === 'MENU' && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center space-y-4 md:space-y-8 z-40 backdrop-blur-md">
                        <div className="relative flex flex-col items-center gap-4 md:gap-6 w-full px-4">
                            {/* Scaled down logo so buttons aren't cut off */}
                            <img src={danpongLogo} alt="DanPong" className="w-[70%] max-w-[420px] h-auto rendering-pixelated drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />

                            <div className="flex flex-col gap-3 items-center w-full">
                                <div className="flex gap-4">
                                    {/* Brand Blue Button */}
                                    <button onClick={startGame} className="group relative px-6 md:px-10 py-3 md:py-4 bg-[hsl(var(--accent))] hover:brightness-110 text-white font-black text-sm md:text-xl uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,85,255,0.6)] border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 md:w-5 md:h-5" />
                                            Start
                                        </div>
                                    </button>
                                    <button onClick={() => setGameState('LEADERBOARD')} className="px-4 md:px-6 py-3 md:py-4 bg-[#222] hover:bg-[#333] text-white font-bold text-sm md:text-base uppercase tracking-widest border border-white/10 rounded transition-all hover:border-yellow-500/50">
                                        <Trophy className="w-4 h-4 md:w-5 md:h-5 inline-block mr-2 text-yellow-500" />
                                        Scores
                                    </button>
                                </div>

                                <button onClick={() => setGameState('INSTRUCTIONS')} className="text-xs text-blue-300 hover:text-white uppercase tracking-widest font-bold border-b border-transparent hover:border-white transition-colors pb-1 mt-2">
                                    How to Play
                                </button>
                            </div>

                            <p className="text-blue-200/50 text-[10px] md:text-xs font-mono mt-2 md:mt-4 crt-flicker hidden md:block">PRESS SPACE TO START</p>
                            <p className="text-blue-200/50 text-[10px] md:text-xs font-mono mt-2 md:mt-4 crt-flicker md:hidden">TAP TO START</p>

                            <div className="text-[#333] text-[8px] md:text-[10px] font-mono opacity-50 flex gap-4 mt-4 md:mt-8">
                                <span>DAN_OS V2.0</span>
                                <span>•</span>
                                <span>BUILT WITH <span className="text-red-900">♥</span> IN COLORADO</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* INSTRUCTIONS OVERLAY */}
                {gameState === 'INSTRUCTIONS' && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-40">
                        <div className="w-[500px] bg-[#111] p-8 rounded-xl border border-white/10 shadow-2xl relative">
                            <button onClick={() => setGameState('MENU')} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>

                            <h2 className="text-2xl font-black text-white tracking-widest text-glow mb-8 text-center border-b border-white/10 pb-4">HOW TO PLAY</h2>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-sm">Controls</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <span className="bg-white/10 p-2 rounded">←</span>
                                        <span className="bg-white/10 p-2 rounded">→</span>
                                        <span>Move Paddle</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <span className="bg-white/10 px-3 py-2 rounded text-xs">SPACE</span>
                                        <span>Launch / Serve</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <span className="bg-white/10 p-2 rounded text-xs"><Maximize2 className="w-3 h-3" /></span>
                                        <span>Toggle Fullscreen</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-sm">Mechanics</h3>
                                    <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                                        <li>Break all bricks to advance.</li>
                                        <li>Collect <span className="text-yellow-400 font-bold">?</span> blocks for power-ups.</li>
                                        <li>Avoid the floor! (3 Lives)</li>
                                        <li>Each level has unique physics.</li>
                                    </ul>
                                </div>
                            </div>

                            <button onClick={() => setGameState('MENU')} className="w-full py-3 bg-[hsl(var(--accent))] hover:brightness-110 text-white font-bold uppercase tracking-widest rounded shadow-[0_0_15px_rgba(0,85,255,0.4)]">
                                Got it!
                            </button>
                        </div>
                    </div>
                )}

                {/* LEADERBOARD OVERLAY */}
                {gameState === 'LEADERBOARD' && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-40">
                        <div className="w-[400px] bg-[#111] p-8 rounded-xl border border-white/10 shadow-2xl relative">
                            <button onClick={() => setGameState('MENU')} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <Trophy className="w-8 h-8 text-yellow-400" />
                                <h2 className="text-3xl font-black text-white tracking-widest text-glow">HIGH SCORES</h2>
                            </div>

                            <div className="space-y-3 mb-8">
                                {highScores.map((s, i) => (
                                    <div key={i} className="flex justify-between font-mono text-lg border-b border-white/5 pb-1">
                                        <span className={`${i < 3 ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>{i + 1}. {s.name}</span>
                                        <span className="text-white text-glow">{s.score.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => setGameState('MENU')} className="w-full py-3 bg-[hsl(var(--accent))] hover:brightness-110 text-white font-bold uppercase tracking-widest rounded shadow-[0_0_15px_rgba(0,85,255,0.4)]">
                                Back to Menu
                            </button>
                        </div>
                    </div>
                )}

                {/* GAME OVER OVERLAY */}
                {gameState === 'GAMEOVER' && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center space-y-6 z-40 backdrop-blur-md">
                        <h2 className="text-6xl font-black text-red-500 text-glow animate-pulse">GAME OVER</h2>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs tracking-widest mb-2">FINAL SCORE</p>
                            <p className="text-5xl font-mono text-white text-glow">{score}</p>
                        </div>

                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 text-center w-80">
                            <p className="mb-4 text-xs font-bold text-yellow-500 tracking-wider">ENTER INITIALS</p>
                            <input
                                maxLength={3}
                                className="bg-transparent border-b-2 border-white/20 text-center text-5xl font-black uppercase tracking-[0.5em] w-full focus:outline-none mb-8 focus:border-yellow-500 transition-colors text-white"
                                value={initials}
                                onChange={e => setInitials(e.target.value)}
                                placeholder="_ _ _"
                                autoFocus
                            />
                            <button onClick={submitScore} className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20 rounded">
                                Submit Score
                            </button>
                        </div>

                        <button onClick={() => setGameState('MENU')} className="text-xs text-gray-600 hover:text-white mt-4 uppercase tracking-widest transition-colors">
                            Return to Menu
                        </button>
                    </div>
                )}

                {/* HIGHSCORE (Success) OVERLAY -> REDIRECTS TO LEADERBOARD NOW */}
                {gameState === 'HIGHSCORE' && (
                    <div className="absolute inset-0 flex items-center justify-center z-40">
                        {/* Transition state, effectively covered by logic in submitScore */}
                    </div>
                )}
            </div>
        </div>
    );
};
