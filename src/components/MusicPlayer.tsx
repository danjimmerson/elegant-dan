import { useState, useRef, useEffect } from "react";

import { motion } from "framer-motion";
import { Disc3, Play, Pause, Volume2, VolumeX, SkipForward, Radio } from "lucide-react";
import { useMusic, STATIONS } from "@/context/MusicContext";
import { Slider } from "@/components/ui/slider";
import TrippyVisuals from "./TrippyVisuals";

const MusicPlayer = () => {
    const { isPlaying, isMuted, volume, currentStation, togglePlay, toggleMute, setVolume, setStation } = useMusic();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-50 flex items-center" ref={containerRef}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-3 rounded-full transition-all duration-300 ${isOpen ? "bg-white text-black" : "text-white hover:bg-white/10"}`}
            >
                <Disc3 className={`w-5 h-5 ${isPlaying ? "animate-spin" : ""}`} />
            </button>

            {/* Persistent Dropdown (Always Mounted) */}
            <motion.div
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" },
                    closed: { opacity: 0, y: -20, scale: 0.95, pointerEvents: "none" }
                }}
                transition={{ duration: 0.2 }}
                className={`absolute top-full right-0 mt-4 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${!isOpen ? "pointer-events-none" : ""}`}
                style={{
                    // CRITICAL: Never use display: none, or the player will unmount/stop.
                    // We use opacity and pointer-events to "hide" it.
                    visibility: "visible",
                }}
            >
                {/* Header / Video Area */}
                <div className="relative h-48 bg-black border-b border-white/10 group overflow-hidden">
                    {/* Visualizer / Album Art Area */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                        <TrippyVisuals isPlaying={isPlaying} />
                    </div>

                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                        <div className="text-xs font-sans font-medium text-accent uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Radio className="w-3 h-3" />
                            {isPlaying ? "Now Broadcasting" : "Station Offline"}
                        </div>
                        <h3 className="text-white font-serif font-bold text-xl truncate shadow-black drop-shadow-md">
                            {currentStation.name}
                        </h3>
                    </div>
                </div>

                {/* Controls */}
                <div className="p-6 space-y-6">
                    {/* Playback Controls */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggleMute}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                        </button>

                        <button
                            onClick={() => {
                                const currentIndex = STATIONS.findIndex(s => s.id === currentStation.id);
                                const nextIndex = (currentIndex + 1) % STATIONS.length;
                                setStation(STATIONS[nextIndex]);
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <SkipForward className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Volume Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 font-sans font-medium">
                            <span>VOL</span>
                            <span>{Math.round(volume * 100)}%</span>
                        </div>
                        <Slider
                            value={[volume * 100]}
                            max={100}
                            step={1}
                            onValueChange={(val) => setVolume(val[0] / 100)}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Station List */}
                    <div className="space-y-2 pt-4 border-t border-white/10">
                        <div className="text-xs text-gray-500 font-sans font-bold uppercase tracking-wider mb-3">Select Frequency</div>
                        {STATIONS.map((station) => (
                            <button
                                key={station.id}
                                onClick={() => setStation(station)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${currentStation.id === station.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                            >
                                <span className="font-sans font-medium">{station.name}</span>
                                {currentStation.id === station.id && isPlaying && (
                                    <div className="flex gap-0.5 items-end h-3">
                                        <span className="w-0.5 h-full bg-accent animate-[music-bar_1s_ease-in-out_infinite]" />
                                        <span className="w-0.5 h-2/3 bg-accent animate-[music-bar_1.2s_ease-in-out_infinite]" />
                                        <span className="w-0.5 h-1/2 bg-accent animate-[music-bar_0.8s_ease-in-out_infinite]" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MusicPlayer;
