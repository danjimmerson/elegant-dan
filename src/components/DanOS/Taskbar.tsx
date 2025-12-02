import { useState, useEffect, useRef } from "react";
import { Power } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logoMark from "@/assets/dan-jimmerson-logo.svg";

interface TaskbarProps {
    openWindows: string[];
    activeWindow: string | null;
    onWindowClick: (id: string) => void;
    onShutdown: () => void;
}

export const Taskbar = ({ openWindows, activeWindow, onWindowClick, onShutdown }: TaskbarProps) => {
    const [time, setTime] = useState(new Date());
    const [isStartOpen, setIsStartOpen] = useState(false);
    const startMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Close start menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
                setIsStartOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Start Menu */}
            <AnimatePresence>
                {isStartOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        ref={startMenuRef}
                        className="absolute bottom-14 left-2 w-64 bg-cream border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[100] font-mono"
                    >
                        <div className="bg-black text-cream px-4 py-2 font-bold border-b-2 border-black">
                            DAN_OS v4.0
                        </div>
                        <div className="p-2 space-y-1">
                            <button
                                onClick={onShutdown}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black hover:text-cream transition-colors text-left font-bold"
                            >
                                <Power className="w-5 h-5" />
                                Shutdown System
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-cream border-t-4 border-black flex items-center justify-between px-2 z-50 font-mono">
                <div className="flex items-center gap-4 h-full py-2">
                    {/* Start Button */}
                    <button
                        onClick={() => setIsStartOpen(!isStartOpen)}
                        className={`h-full px-6 flex items-center gap-2 border-2 border-black font-bold uppercase tracking-wider transition-colors ${isStartOpen ? "bg-gray-400 text-black" : "bg-gray-300 text-black hover:bg-gray-200"
                            }`}
                    >
                        <img src={logoMark} alt="D" className="h-5 w-5" />
                        Start
                    </button>

                    {/* Divider */}
                    <div className="w-[2px] h-full bg-black mx-2" />

                    {/* Open Windows */}
                    <div className="flex gap-2 h-full">
                        {openWindows.map((id) => (
                            <button
                                key={id}
                                onClick={() => onWindowClick(id)}
                                className={`h-full px-4 min-w-[140px] text-left truncate text-sm flex items-center border-2 transition-all ${activeWindow === id
                                    ? "bg-gray-400 text-black border-black font-bold shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                                    : "bg-white text-black border-black hover:bg-gray-100"
                                    }`}
                            >
                                {id}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clock */}
                <div className="h-full py-2">
                    <div className="h-full px-6 bg-white border-2 border-black flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </>
    );
};
