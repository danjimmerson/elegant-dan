import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Quote } from "lucide-react";

import testimonialsIllustration from "@/assets/testimonials-illustration.jpg";

import testimonials from "@/data/testimonials";

interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    company: string;
    image: string;
    color: string;
}

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

const TestimonialCard = ({ t }: { t: Testimonial }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="w-[85vw] md:w-[450px] relative group flex-shrink-0 select-none h-full cursor-pointer">
                    {/* Background Container */}
                    <div className="absolute inset-0 bg-black border border-white/10 rounded-[2rem] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                        {/* Animated Background Glow */}
                        <motion.div
                            className="absolute w-[400px] h-[400px] rounded-full opacity-30 blur-[80px]"
                            style={{ backgroundColor: t.color }}
                            animate={{
                                x: [0, 150, -150, 0],
                                y: [0, -150, 150, 0],
                                scale: [1, 1.5, 0.8, 1],
                                rotate: [0, 90, 180, 0]
                            }}
                            transition={{
                                duration: 8 + Math.random() * 5,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut"
                            }}
                        />
                        {/* Cropped Quote Icon */}
                        <Quote
                            className="absolute -top-10 -left-6 w-32 h-32 z-0 opacity-100"
                            fill={t.color}
                            stroke="none"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-8 md:p-10 flex flex-col justify-between h-full min-h-[400px]">
                        <div className="mt-16 mb-6">
                            <p className="text-lg md:text-xl font-sans leading-relaxed text-white drop-shadow-md line-clamp-4">
                                "{t.quote}"
                            </p>
                            <span className="inline-block mt-4 text-sm font-medium text-white/70 group-hover:text-white transition-colors border-b border-transparent group-hover:border-white/50">
                                Read full endorsement →
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mt-auto pt-6">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                                <img
                                    src={t.image}
                                    alt={t.author}
                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                    draggable={false}
                                />
                            </div>
                            <div>
                                <div className="font-bold text-base font-mono uppercase tracking-tight text-white">{t.author}</div>
                                <div className="text-xs text-gray-400 font-mono text-left">{t.role}{t.company ? `, ${t.company}` : ''}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-2xl bg-black/95 border-white/10 text-white p-0 overflow-hidden">
                <div className="relative p-8 md:p-12 overflow-hidden">
                    {/* Ambient Background for Modal */}
                    <div
                        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] pointer-events-none"
                        style={{ backgroundColor: t.color }}
                    />

                    <div className="relative z-10">
                        <Quote className="w-12 h-12 mb-6 opacity-80" fill={t.color} stroke="none" />

                        <p className="text-xl md:text-2xl font-sans leading-relaxed text-white/90 mb-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            "{t.quote}"
                        </p>

                        <div className="flex items-center gap-5 border-t border-white/10 pt-8">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                                <img
                                    src={t.image}
                                    alt={t.author}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-lg font-mono uppercase tracking-tight text-white">{t.author}</div>
                                <div className="text-sm text-gray-400 font-mono">{t.role}</div>
                                {t.company && <div className="text-sm text-gray-400 font-mono">{t.company}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const Testimonials = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Optimized loop for "infinite" feel without excessive DOM
    const loopTestimonials = Array(6).fill(testimonials).flat();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Add spring physics for fluid momentum
    const smoothProgress = useSpring(scrollYProgress, {
        damping: 20,
        stiffness: 100,
        mass: 0.5
    });

    // Reduced speed: multiply by 0.25 for a more elegant, subtle parallax
    const x = useTransform(smoothProgress, [0, 1], [0, -((350 + 32) * (loopTestimonials.length / 2) * 0.25)]);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section ref={containerRef} className="py-24 lg:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 relative">
                <div>
                    <span className="text-accent font-bold tracking-widest uppercase mb-4 block">Endorsements</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-black leading-tight">
                        Trusted by<br />Industry Leaders
                    </h2>
                </div>
                <img
                    src={testimonialsIllustration}
                    alt="Relaxing while Dan works"
                    className="hidden md:block absolute top-0 right-6 w-44 md:static md:w-96 grayscale mix-blend-multiply contrast-125 brightness-110 opacity-90 -rotate-6 md:translate-y-3"
                />
            </div>

            {/* Draggable Slider Container */}
            <div className="relative w-full cursor-grab active:cursor-grabbing">
                <motion.div
                    style={{ x: isMobile ? 0 : x }}
                    className="flex gap-8 px-6 lg:px-12 w-max items-stretch"
                    drag="x"
                    dragConstraints={{ right: 0, left: -((350 + 32) * (loopTestimonials.length - 2)) }}
                    whileTap={{ cursor: "grabbing" }}
                >
                    {loopTestimonials.map((t, index) => (
                        <TestimonialCard key={`${t.id}-${index}`} t={t} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
