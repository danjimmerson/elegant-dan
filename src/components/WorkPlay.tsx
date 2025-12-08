import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Gamepad2, Code2, Sparkles, Briefcase, Play, Shapes } from "lucide-react";
import testimonialsIllustration from "@/assets/testimonials-illustration.jpg";
import queenMaryVideo from "@/assets/Queen_Mary_Cinematic_K_Video.mp4";

// Combined Data
const items = [
    // Work Items
    {
        id: 1,
        type: "work",
        title: "Neon Horizon",
        category: "Brand Strategy",
        description: "A complete rebrand for a fintech unicorn, focusing on trust, speed, and the future of money.",
        color: "from-accent to-accent-tangerine",
        tags: ["Strategy", "Identity", "Web Design"],
        links: { github: "#", external: "#" }
    },
    {
        id: 2,
        type: "work",
        title: "Velocity AI",
        category: "Product Design",
        description: "Designing the interface for a next-gen AI agent that feels human, intuitive, and incredibly fast.",
        color: "from-accent-jungle to-accent-amber",
        tags: ["UI/UX", "React", "AI Integration"],
        links: { github: "#", external: "#" },
        video: queenMaryVideo
    },
    {
        id: 3,
        type: "work",
        title: "Echo Chamber",
        category: "Web Development",
        description: "An immersive audio-visual experience for a music festival, built with Three.js and WebGL.",
        color: "from-accent-lavender to-accent-copper",
        tags: ["Three.js", "WebGL", "Audio API"],
        links: { github: "#", external: "#" }
    },
    // Play Items
    {
        id: 4,
        type: "play",
        title: "DanPong",
        category: "Interactive Game",
        description: "A retro-style breakout game built with React & Canvas. Features custom physics and sound synthesis.",
        icon: <Gamepad2 className="w-8 h-8" />,
        color: "bg-blue-500",
        tags: ["Game Dev", "Canvas API", "Audio API"],
        links: { play: "#" }
    },
    {
        id: 5,
        type: "play",
        title: "Neural Feed",
        category: "Experiment",
        description: "AI-curated content stream with real-time sentiment analysis and personalized ranking algorithms.",
        icon: <Sparkles className="w-8 h-8" />,
        color: "bg-purple-500",
        tags: ["AI/ML", "Python", "FastAPI"],
        links: { demo: "#" }
    },
    {
        id: 6,
        type: "play",
        title: "System Design",
        category: "Architecture",
        description: "Visualizing complex marketing systems as interactive code diagrams.",
        icon: <Code2 className="w-8 h-8" />,
        color: "bg-green-500",
        tags: ["Visualization", "D3.js", "React Flow"],
        links: { view: "#" }
    }
];

const BackgroundVideo = ({ src }: { src: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            setTimeout(() => {
                if (video) {
                    video.currentTime = 0;
                    video.play();
                }
            }, 5000); // Wait 5 seconds before restarting
        };

        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);
    }, []);

    return (
        <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            playsInline
            // Scale 1.35 to zoom in and remove baked-in black bars
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-[1.35]"
        />
    );
};

const WorkPlay = () => {
    const [mode, setMode] = useState<"work" | "play">("work");
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter items based on mode
    const activeItems = items.filter(item => item.type === mode);

    return (
        <section
            ref={containerRef}
            className={`relative transition-colors duration-700 py-24 lg:py-32 ${mode === "work" ? "bg-white text-black" : "bg-black text-white"}`}
        >
            <div className="container mx-auto px-6 lg:px-12">
                {/* Full Width Header */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-16 gap-8 lg:gap-12 relative">
                    <div className="max-w-3xl z-10">
                        <span className={`font-bold tracking-widest uppercase mb-4 block transition-colors duration-500 ${mode === "work" ? "text-accent" : "text-accent-tangerine"}`}>
                            Showcase
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
                            Work and Play
                        </h2>
                        <p className={`text-lg md:text-xl leading-relaxed max-w-xl ${mode === "work" ? "text-gray-600" : "text-gray-400"}`}>
                            A collection of strategic initiatives, product designs, and creative experiments that push the boundaries of what's possible.
                        </p>
                    </div>

                    <img
                        src={testimonialsIllustration}
                        alt="Creative process"
                        className="absolute top-0 right-0 w-48 lg:w-80 grayscale mix-blend-multiply contrast-125 brightness-110 opacity-50 -rotate-6 hidden lg:block pointer-events-none"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sticky Sidebar (Toggle + Nav) */}
                    <div className="lg:w-4/12">
                        <div className="lg:sticky lg:top-32">
                            {/* Interactive Toggle */}
                            <div className="flex items-center gap-2 mb-12 p-1 border-2 border-black rounded-full w-fit bg-white">
                                <button
                                    onClick={() => setMode("work")}
                                    className={`relative px-6 py-2 rounded-full font-bold text-lg transition-colors duration-300 ${mode === "work" ? "text-white" : "text-black hover:text-gray-600"}`}
                                >
                                    {mode === "work" && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-black rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> Work
                                    </span>
                                </button>
                                <button
                                    onClick={() => setMode("play")}
                                    className={`relative px-6 py-2 rounded-full font-bold text-lg transition-colors duration-300 ${mode === "play" ? "text-white" : "text-black hover:text-gray-600"}`}
                                >
                                    {mode === "play" && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-black rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Gamepad2 className="w-4 h-4" /> Play
                                    </span>
                                </button>
                            </div>

                            {/* Navigation List */}
                            <div className="hidden lg:block">
                                <ul className="space-y-4">
                                    {activeItems.map((item, index) => (
                                        <li key={item.id} className="group cursor-pointer flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                                            <span className="text-sm font-mono">0{index + 1}</span>
                                            <span className="text-lg font-medium">{item.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Gallery */}
                    <div className="lg:w-8/12">
                        <div className="space-y-24">
                            <AnimatePresence mode="popLayout">
                                {activeItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group"
                                    >
                                        {/* Card */}
                                        <div className={`relative rounded-[2.5rem] overflow-hidden mb-8 border ${mode === "work" ? "border-black/5 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                                            {/* Image/Visual Area */}
                                            <div className="h-[400px] md:h-[500px] relative overflow-hidden">
                                                {/* Video Background */}
                                                {item.video ? (
                                                    <BackgroundVideo src={item.video} />
                                                ) : (
                                                    mode === "work" ? (
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                                                    ) : (
                                                        <div className={`absolute inset-0 ${item.color} opacity-10 blur-[80px] group-hover:opacity-20 transition-opacity duration-500`} />
                                                    )
                                                )}

                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {item.icon ? (
                                                        <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white transform group-hover:scale-110 transition-transform duration-500">
                                                            {item.icon}
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                                                            <ArrowUpRight className="w-8 h-8 text-black" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Category Badge */}
                                                <div className="absolute top-8 left-8">
                                                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-md border ${mode === "work" ? "bg-white/80 border-black/5 text-black" : "bg-black/40 border-white/10 text-white"}`}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="px-4">
                                            <h3 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h3>
                                            <p className={`text-xl leading-relaxed mb-6 max-w-2xl ${mode === "work" ? "text-gray-600" : "text-gray-400"}`}>
                                                {item.description}
                                            </p>

                                            <div className="flex flex-wrap gap-3">
                                                {item.tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className={`text-sm font-mono px-3 py-1 rounded-full border ${mode === "work" ? "border-black/10 text-gray-500" : "border-white/10 text-gray-500"}`}
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkPlay;
