import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DanOSLauncher } from "./DanOSLauncher";
import { DanOSOverlay } from "./DanOSOverlay";

export const DanOS = () => {
    const [isOSOpen, setIsOSOpen] = useState(false);

    return (
        <>
            <div className="w-full bg-white py-24 lg:py-32">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Typography */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <span className="text-accent font-bold tracking-widest uppercase block">The Operating System</span>
                                <h2 className="text-5xl md:text-7xl font-serif font-bold text-black leading-tight">
                                    About Dan
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                    I treat growth marketing as an engineering problem. It's not about guessing; it's about building systems that produce predictable results.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-gray-100 max-w-md">
                                <div>
                                    <div className="text-4xl lg:text-5xl font-black font-sans animate-text-shine">15+</div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider font-mono mt-1">Years Exp.</div>
                                </div>
                                <div>
                                    <div className="text-4xl lg:text-5xl font-black font-sans animate-text-shine">$2B+</div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider font-mono mt-1">Revenue Gen</div>
                                </div>
                                <div>
                                    <div className="text-4xl lg:text-5xl font-black font-sans animate-text-shine">2x</div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider font-mono mt-1">Execution Award</div>
                                </div>
                                <div>
                                    <div className="text-4xl lg:text-5xl font-black font-sans animate-text-shine">Top</div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider font-mono mt-1">Microsoft Awards</div>
                                </div>
                            </div>

                            <p className="text-lg text-gray-500 font-mono pt-4">
                                <motion.span
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-accent font-bold inline-block mr-2"
                                >
                                    &gt;
                                </motion.span>
                                Click the avatar to boot Dan_OS and see more about Dan...
                            </p>
                        </div>

                        {/* Right: Launcher */}
                        <div className="block md:flex md:justify-end">
                            <DanOSLauncher onLaunch={() => setIsOSOpen(true)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* OS Overlay */}
            <AnimatePresence>
                {isOSOpen && <DanOSOverlay onClose={() => setIsOSOpen(false)} />}
            </AnimatePresence>
        </>
    );
};
