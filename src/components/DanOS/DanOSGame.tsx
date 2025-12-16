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

    // ... (keep audio resume effect)

    // ... (keep generateAssets and getAudioCtx)

    // ... (keep playSound)

    // ... (keep loadLevel)

    const startGame = () => {
        setScore(0);
        setLives(3);
        setCurrentLevel(0);
        loadLevel(0);
        setGameState('PLAYING');
        try { if (audioCtxRef.current) audioCtxRef.current.resume(); } catch { }
        // Force update rect on start to ensure accurate initial input
        setTimeout(updateRect, 100);
    };

    // ... (inside the useEffect for game loop)

    const handleInput = (clientX: number) => {
        if (!canvas) return;
        // PERFORMANCE: Use cached rect
        const rect = rectRef.current || canvas.getBoundingClientRect();

        const scaleX = CANVAS_WIDTH / rect.width;
        const relativeX = (clientX - rect.left) * scaleX;

        const PWIDTH = gameRef.current.paddleWidth;
        let newPaddleX = relativeX - PWIDTH / 2;

        if (newPaddleX < 0) newPaddleX = 0;
        if (newPaddleX > CANVAS_WIDTH - PWIDTH) newPaddleX = CANVAS_WIDTH - PWIDTH;

        gameRef.current.paddleX = newPaddleX;
    };

    // ... (render return)

    const isMobilePlaying = isMobile && gameState === 'PLAYING';

    return (
        <div
            ref={containerRef}
            className={`flex flex-col items-center justify-center p-4 bg-[#0a0a0a] text-white font-mono relative select-none transition-all duration-300 
            ${isFullscreen ? 'w-full h-full' : ''}
            ${isMobilePlaying ? 'fixed inset-0 z-[100] w-full h-full bg-black' : 'w-full h-full md:w-auto md:h-full'}`}
        >
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
                    {/* FULLSCREEN TOGGLE - Hide on mobile playing as it's auto-fullscreen */}
                    {!isMobilePlaying && (
                        <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded transition-colors text-blue-400">
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                    )}
                    {/* CLOSE BUTTON */}
                    {!isFullscreen && !isMobilePlaying && (
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded transition-colors text-red-500">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className={`relative bg-black border-[2px] md:border-[4px] border-[#333] shadow-[0_0_15px_rgba(0,0,0,0.9)] md:shadow-[0_0_30px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden ring-1 ring-white/10 
                ${isFullscreen || isMobilePlaying ? 'h-auto max-h-[85vh] aspect-[4/3] w-full' : 'w-full max-w-[800px] aspect-[4/3] h-auto'}
            `}>
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
