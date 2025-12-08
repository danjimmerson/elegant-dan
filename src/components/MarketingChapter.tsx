import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MarketingChapterProps {
    videoSrc: string;
    subtitle: string;
    title: React.ReactNode;
    description: string;
    showCta?: boolean;
    gradientColor?: string;
}

const MarketingChapter = ({
    videoSrc,
    subtitle,
    title,
    description,
    showCta = false,
    gradientColor = "from-black/80"
}: MarketingChapterProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(containerRef, { margin: "-10% 0px -10% 0px" });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax / Opacity effects
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    // Handle Video Playback
    useEffect(() => {
        if (isInView) {
            videoRef.current?.play().catch(() => { });
        } else {
            videoRef.current?.pause();
        }
    }, [isInView]);

    return (
        <section ref={containerRef} className="relative h-[150vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Background Video */}
                <motion.div
                    style={{ scale }}
                    className="absolute inset-0 w-full h-full"
                >
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover scale-125" // Increased scale to hide bars
                    />
                    {/* Gradients */}
                    <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${gradientColor} to-transparent z-10`} />
                    <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${gradientColor} to-transparent z-10`} />
                    {/* Mobile Specific Gradient for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 md:hidden z-10" />
                    {/* Global Overlay - Darker on Mobile */}
                    <div className="absolute inset-0 bg-black/60 md:bg-black/40 z-0" />
                </motion.div>

                {/* Content */}
                <motion.div
                    style={{ opacity, y }}
                    className="relative z-20 max-w-4xl px-6 text-center text-white"
                >
                    <span className="bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent font-bold tracking-widest uppercase mb-6 block text-sm md:text-base">
                        {subtitle}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto font-light mb-10">
                        {description}
                    </p>

                    {showCta && (
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105"
                        >
                            Start the Conversation <ArrowRight className="w-5 h-5" />
                        </Link>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default MarketingChapter;
