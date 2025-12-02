import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";

import testimonialsIllustration from "@/assets/testimonials-illustration.jpg";

import testimonialsData from "@/data/testimonials.json";

interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    company: string;
    image: string;
    color: string;
}

const testimonials: Testimonial[] = testimonialsData;

const TestimonialCard = ({ t }: { t: Testimonial }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 120;
    const shouldTruncate = t.quote.length > maxLength;
    const displayQuote = isExpanded || !shouldTruncate ? t.quote : `${t.quote.substring(0, maxLength)}...`;

    return (
        <div className="w-[350px] md:w-[450px] min-h-[450px] relative group flex-shrink-0 select-none">
            {/* Background Container */}
            <div className="absolute inset-0 bg-black border border-white/10 rounded-[2rem] overflow-hidden">
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
            <div className="relative z-10 p-8 md:p-10 flex flex-col justify-between h-full">
                <div className="mt-16 mb-6">
                    <p className="text-lg md:text-xl font-sans leading-relaxed text-white drop-shadow-md">
                        "{displayQuote}"
                    </p>
                    {shouldTruncate && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent drag interference if needed
                                setIsExpanded(!isExpanded);
                            }}
                            className="mt-3 text-sm font-bold uppercase tracking-wider text-accent hover:text-white transition-colors focus:outline-none"
                        >
                            {isExpanded ? "Read Less" : "Read More"}
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-auto">
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
                        <div className="text-xs text-gray-400 font-mono">{t.role}, {t.company}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Create a massive loop for "infinite" feel
    const loopTestimonials = Array(20).fill(testimonials).flat();

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
                    className="absolute top-0 right-6 w-44 md:static md:w-96 grayscale mix-blend-multiply contrast-125 brightness-110 opacity-90 -rotate-6 md:translate-y-3"
                />
            </div>

            {/* Draggable Slider Container */}
            <div className="relative w-full cursor-grab active:cursor-grabbing">
                <motion.div
                    className="flex gap-8 px-6 lg:px-12 w-max"
                    drag="x"
                    dragConstraints={{ right: 0, left: -((350 + 32) * loopTestimonials.length) }} // Calculate rough width
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
