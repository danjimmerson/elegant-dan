import { useEffect, useRef } from 'react';

interface TrippyVisualsProps {
    isPlaying: boolean;
    mode?: number;
}

const TrippyVisuals = ({ isPlaying, mode }: TrippyVisualsProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const modeRef = useRef<number>(mode !== undefined ? mode : Math.floor(Math.random() * 3));

    // Update mode if prop changes
    useEffect(() => {
        if (mode !== undefined) {
            modeRef.current = mode;
        }
    }, [mode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 300;
            canvas.height = canvas.parentElement?.clientHeight || 150;
            if (modeRef.current === 2) initStars();
        };

        // --- Utils ---
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        // --- Mode 0: Aurora (Waves) ---
        const renderAurora = () => {
            // Dark night sky background
            const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, '#020014'); // Dark blue/black
            bgGradient.addColorStop(1, '#090929');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = 'screen';

            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                const opacity = 0.4 - (i * 0.1);
                // Green/Teal/Purple gradients
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                gradient.addColorStop(0, `hsla(${160 + time * 0.5 + i * 20}, 80%, 50%, 0)`);
                gradient.addColorStop(0.5, `hsla(${160 + time * 0.5 + i * 20}, 80%, 50%, ${opacity})`);
                gradient.addColorStop(1, `hsla(${160 + time * 0.5 + i * 20}, 80%, 50%, 0)`);

                ctx.fillStyle = gradient;

                // Draw wavy shape
                const offset = i * 50;
                ctx.moveTo(0, canvas.height);
                for (let x = 0; x <= canvas.width; x += 10) {
                    const y = canvas.height / 2 +
                        Math.sin((x + time * 2) * 0.005 + offset) * 50 +
                        Math.sin((x + time) * 0.01) * 20;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
            time += 1;
        };

        // --- Mode 1: Nebula (Soft Clouds) ---
        const renderNebula = () => {
            // Deep space bg
            ctx.fillStyle = '#05000a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = 'lighter';

            // Draw moving "clouds" (large glowing circles)
            for (let i = 0; i < 5; i++) {
                const x = (Math.sin(time * 0.01 + i) * 0.5 + 0.5) * canvas.width;
                const y = (Math.cos(time * 0.015 + i * 2) * 0.5 + 0.5) * canvas.height;
                const radius = 100 + Math.sin(time * 0.02) * 20;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `hsla(${280 + i * 30 + time * 0.5}, 70%, 50%, 0.3)`);
                gradient.addColorStop(1, `hsla(${280 + i * 30 + time * 0.5}, 70%, 50%, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';
            time += 1;
        };

        // --- Mode 2: Stars (Particles) ---
        class Particle {
            x: number;
            y: number;
            size: number;
            speed: number;
            brightness: number;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 1.5;
                this.speed = Math.random() * 0.5 + 0.1;
                this.brightness = Math.random();
            }

            update(w: number, h: number) {
                this.y -= this.speed; // Float up
                this.brightness += Math.sin(time * 0.05 + this.x) * 0.02; // Twinkle using sine

                if (this.y < 0) {
                    this.y = h;
                    this.x = Math.random() * w;
                }
            }

            draw() {
                if (!ctx) return;
                const opacity = Math.max(0, Math.min(1, 0.5 + this.brightness * 0.5));
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initStars = () => {
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const renderStars = () => {
            // Gradient Sky
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0b1026');
            gradient.addColorStop(1, '#2b32b2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update(canvas.width, canvas.height);
                p.draw();
            });
            time += 1;
        };

        const animate = () => {
            if (!ctx) return;

            // Paused State: Draw a static but beautiful background (slowly shifting)
            if (!isPlaying) {
                const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                bgGradient.addColorStop(0, `hsl(${200 + Math.sin(Date.now() * 0.0002) * 20}, 40%, 10%)`);
                bgGradient.addColorStop(1, `hsl(${260 + Math.sin(Date.now() * 0.0003) * 20}, 40%, 5%)`);
                ctx.fillStyle = bgGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                const mode = modeRef.current;
                if (mode === 0) renderAurora();
                else if (mode === 1) renderNebula();
                else if (mode === 2) renderStars();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
        />
    );
};

export default TrippyVisuals;
