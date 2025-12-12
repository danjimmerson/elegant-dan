import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Sparkles, X } from "lucide-react";
import logoMarkBlack from "@/assets/dan-jimmerson-logo-black.svg";
import { useContact } from "@/context/ContactContext";
import Newsletter from "@/components/Newsletter";

const Contact = () => {
    const { openContact } = useContact();
    const [showNewsletter, setShowNewsletter] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse interaction for 3D logo effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX / innerWidth - 0.5);
        mouseY.set(clientY / innerHeight - 0.5);
    };

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { damping: 20, stiffness: 100 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 20, stiffness: 100 });

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative py-24 lg:py-32 min-h-[90vh] flex items-center overflow-hidden bg-white text-black"
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-accent-tangerine/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-accent-purple/10 rounded-full blur-[120px]"
                />

                {/* Interactive 3D Logo Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                    <motion.div
                        style={{ rotateX, rotateY, perspective: 1000 }}
                        className="w-[800px] h-[800px] relative"
                    >
                        <img src={logoMarkBlack} alt="" className="w-full h-full object-contain" />
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column: CTA & Newsletter */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-accent font-bold tracking-widest uppercase mb-6 block"
                        >
                            Get in Touch
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-12"
                        >
                            Let's do<span className="md:hidden"> </span><br className="hidden md:block" />something<br /><span className="animate-text-shine-gold">extraordinary.</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-8 items-center"
                        >
                            <button
                                onClick={openContact}
                                className="group relative px-8 py-4 bg-black text-white rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Speak to Dan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                            </button>

                            <button
                                onClick={() => setShowNewsletter(true)}
                                className="group px-6 py-4 rounded-full border border-black/10 hover:border-accent hover:bg-accent/5 transition-all flex items-center gap-3 font-medium"
                            >
                                <Sparkles className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform" />
                                <span>Get the Newsletter</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Status Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <div className="p-8 lg:p-12 bg-white/80 backdrop-blur-xl rounded-[2rem] lg:rounded-[3rem] border border-white/40 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-50" />

                            <div className="relative z-10">
                                <img src={logoMarkBlack} alt="Dan Jimmerson" className="w-20 h-20 object-contain mb-6" />
                                <h3 className="text-2xl font-bold mb-6">Current Status</h3>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="relative flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                                    </span>
                                    <span className="font-mono text-lg font-medium">Open to new opportunities</span>
                                </div>

                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    I'm currently available for fractional CMO roles, strategic advisory, and select speaking engagements.
                                </p>

                                <div className="pt-8 border-t border-gray-100">
                                    <div className="text-sm text-gray-400 font-mono uppercase tracking-wider mb-2">Location</div>
                                    <div className="text-xl font-bold">Denver, CO / Remote</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Newsletter Overlay */}
            <AnimatePresence>
                {showNewsletter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setShowNewsletter(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-black relative rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <button
                                onClick={() => setShowNewsletter(false)}
                                className="absolute top-6 right-6 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <Newsletter />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Contact;
