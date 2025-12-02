import { motion } from "framer-motion";
import { Power } from "lucide-react";
import danWelcome from "@/assets/dan-welcome.png";
import avatarVideo from "@/assets/avatar-video.mp4";
import logoMark from "@/assets/dan-jimmerson-logo.svg";

interface DanOSLauncherProps {
    onLaunch: () => void;
}

export const DanOSLauncher = ({ onLaunch }: DanOSLauncherProps) => {
    return (
        <div className="relative group cursor-pointer" onClick={onLaunch}>
            {/* Card Container */}
            <div className="w-full md:w-[400px] bg-cream border-2 border-black rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

                {/* 8-bit Header Label */}
                <div className="bg-black px-4 py-3 flex items-center justify-between border-b-2 border-black">
                    <div className="flex items-center gap-3">
                        <img src={logoMark} alt="DanOS Logo" className="w-6 h-6 brightness-0 invert rendering-pixelated" />
                        <span className="font-mono font-bold text-lg tracking-widest text-accent">DAN_OS V4.3</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                        <div className="w-3 h-3 bg-gray-600 rounded-full" />
                    </div>
                </div>

                {/* Video Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-white border-b-2 border-black">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover object-center filter grayscale contrast-110 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500"
                    >
                        <source src={avatarVideo} type="video/mp4" />
                        {/* Fallback image */}
                        <img
                            src={danWelcome}
                            alt="Launch DanOS"
                            className="w-full h-full object-cover"
                        />
                    </video>

                    {/* Glitch/Overlay Effect */}
                    <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay pointer-events-none" />
                </div>

                {/* Footer / Button Area */}
                <div className="p-6 bg-cream flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs font-mono text-gray-500 uppercase tracking-wider">
                        <span>System Ready</span>
                        <span>128kb Memory</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLaunch();
                        }}
                        className="group/btn relative flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-full font-bold text-xl tracking-wider overflow-hidden transition-transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                        <Power className="w-6 h-6" />
                        <span>BOOT SYSTEM</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
