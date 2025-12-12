import { useState, useEffect } from "react";
import { PersonalInjury } from "./PersonalInjury";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Trash2, Gamepad2, LogOut } from "lucide-react";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";
import { BootScreen } from "./BootScreen";
import { DanOSGame } from "./DanOSGame";
import { SystemProtocols } from "./SystemProtocols";
import { GrowthPhilosophy } from "./GrowthPhilosophy";
import { TrackRecord } from "./TrackRecord";
import { AboutDan } from "./AboutDan";
import { qaData } from "../about/qaData";
import flatironsImg from "@/assets/pixel_flatirons.jpg";
import logoMark from "@/assets/dan-jimmerson-logo.svg";

// Import generated icons
import folderIcon from "@/assets/pixel_folder_icon.png";
import trashIcon from "@/assets/pixel_trash_icon.png";

interface DanOSOverlayProps {
    onClose: () => void;
}

export const DanOSOverlay = ({ onClose }: DanOSOverlayProps) => {
    const [booted, setBooted] = useState(false);
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const [activeWindow, setActiveWindow] = useState<string | null>(null);

    // Handle Escape key to close and lock body scroll
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [onClose]);

    const toggleWindow = (id: string) => {
        if (openWindows.includes(id)) {
            setActiveWindow(id);
        } else {
            setOpenWindows([...openWindows, id]);
            setActiveWindow(id);
        }
    };

    const closeWindow = (id: string) => {
        setOpenWindows(openWindows.filter((w) => w !== id));
        if (activeWindow === id) {
            setActiveWindow(null);
        }
    };

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black font-mono select-none"
        >
            {/* Top Right Exit Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[60] group flex items-center gap-3 bg-red-600/90 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold border-2 border-white/20 hover:border-white transition-all shadow-lg hover:shadow-red-900/50 hover:scale-105"
            >
                <span className="uppercase tracking-widest text-sm">Exit Dan_OS</span>
                <LogOut className="w-4 h-4" />
            </button>

            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-[55] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

            {!booted ? (
                <BootScreen onComplete={() => setBooted(true)} />
            ) : (
                <div className="relative w-full h-full overflow-hidden">
                    {/* Wallpaper */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={flatironsImg}
                            alt="Flatirons Boulder"
                            className="w-full h-full object-cover rendering-pixelated"
                        />
                    </div>

                    {/* Desktop Icons */}
                    {/* Desktop Icons - Responsive Grid */}
                    <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col md:flex-row gap-8 md:gap-24 z-10 w-full md:w-auto pointer-events-none">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-6 md:gap-8 pointer-events-auto">
                            <DesktopIcon
                                id="About Dan"
                                icon={logoMark}
                                label="About Dan"
                                onClick={() => toggleWindow("About Dan")}
                            />
                            <DesktopIcon
                                id="System Protocols"
                                icon={folderIcon}
                                label="What I actually do"
                                onClick={() => toggleWindow("System Protocols")}
                            />
                            <DesktopIcon
                                id="Growth Philosophy"
                                icon={folderIcon}
                                label="How I think about growth"
                                onClick={() => toggleWindow("Growth Philosophy")}
                            />
                            <DesktopIcon
                                id="Recycle Bin"
                                icon={trashIcon}
                                label="Recycle Bin"
                                onClick={() => toggleWindow("Recycle Bin")}
                            />
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-6 md:gap-8 pointer-events-auto">
                            <DesktopIcon
                                id="Game"
                                icon={Gamepad2} // Using Gamepad2 icon
                                label="DanPong"
                                onClick={() => toggleWindow("Game")}
                            />
                            <DesktopIcon
                                id="Personal Injury"
                                icon={folderIcon}
                                label="Personal Injury"
                                onClick={() => toggleWindow("Personal Injury")}
                            />
                            <DesktopIcon
                                id="Track Record"
                                icon={folderIcon}
                                label="Proof it works"
                                onClick={() => toggleWindow("Track Record")}
                            />
                        </div>
                    </div>

                    {/* Windows */}
                    <AnimatePresence>
                        {openWindows.map((id) => (
                            <Window
                                key={id}
                                id={id}
                                title={id === "Game" ? "DanPong - Play me" : id}
                                isActive={activeWindow === id}
                                onClose={() => closeWindow(id)}
                                onFocus={() => setActiveWindow(id)}
                                initialWidth={900}
                                initialHeight={650}
                            >
                                {id === "About Dan" && (
                                    <AboutDan />
                                )}
                                {id === "System Protocols" && <SystemProtocols />}
                                {id === "Growth Philosophy" && <GrowthPhilosophy />}
                                {id === "Track Record" && <TrackRecord />}
                                {id === "Personal Injury" && (
                                    <PersonalInjury />
                                )}
                                {id === "Game" && (
                                    <DanOSGame onClose={() => closeWindow("Game")} />
                                )}
                                {id === "Recycle Bin" && (
                                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                                        The bin is empty.
                                    </div>
                                )}
                            </Window>
                        ))}
                    </AnimatePresence>

                    {/* Taskbar */}
                    <Taskbar
                        openWindows={openWindows}
                        activeWindow={activeWindow}
                        onWindowClick={toggleWindow}
                        onShutdown={onClose}
                    />
                </div>
            )}
        </motion.div>,
        document.body
    );
};
