import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Trash2, Gamepad2, LogOut } from "lucide-react";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";
import { BootScreen } from "./BootScreen";
import { DanOSGame } from "./DanOSGame";
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
                    <div className="absolute top-8 left-8 flex flex-col gap-8 z-10">
                        <DesktopIcon
                            id="About Dan"
                            icon={logoMark}
                            label="About Dan"
                            onClick={() => toggleWindow("About Dan")}
                        />
                        <DesktopIcon
                            id="About"
                            icon={folderIcon}
                            label="What I actually do"
                            onClick={() => toggleWindow("About")}
                        />
                        <DesktopIcon
                            id="Projects"
                            icon={folderIcon}
                            label="How I think about growth"
                            onClick={() => toggleWindow("Projects")}
                        />
                        <DesktopIcon
                            id="Contact"
                            icon={folderIcon}
                            label="Proof it works"
                            onClick={() => toggleWindow("Contact")}
                        />
                        <DesktopIcon
                            id="Game"
                            icon={Gamepad2} // Using Gamepad2 icon
                            label="DanPong"
                            onClick={() => toggleWindow("Game")}
                        />
                        <DesktopIcon
                            id="Recycle Bin"
                            icon={trashIcon}
                            label="Recycle Bin"
                            onClick={() => toggleWindow("Recycle Bin")}
                        />
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
                                {id === "About" && (
                                    <div className="p-6 space-y-8">
                                        <div>
                                            <h3 className="font-bold border-b-2 border-black pb-2 mb-4 uppercase tracking-widest text-sm">
                                                System Protocols
                                            </h3>
                                            <ul className="space-y-3 font-mono text-sm leading-relaxed break-words">
                                                <li className="flex gap-3">
                                                    <span className="text-accent shrink-0">&gt;</span>
                                                    <span>Translate firm goals into channel strategy, budgets, and CAC targets.</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-accent shrink-0">&gt;</span>
                                                    <span>Own the mix across brand, PI lead gen, paid/local search, and social.</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-accent shrink-0">&gt;</span>
                                                    <span>Build feedback loops with intake, call center, and ops to optimize for cases, not clicks.</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-accent shrink-0">&gt;</span>
                                                    <span>Design experiments, kill what doesn't work fast, double-down on what moves pipeline.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-bold border-b-2 border-black pb-2 mb-4 uppercase tracking-widest text-sm">
                                                Active Modules
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    "Revenue Marketing",
                                                    "GEO / AEO",
                                                    "Growth Strategy",
                                                    "Data Engineering",
                                                    "Full-Funnel Analytics",
                                                    "Conversion Rate Opt"
                                                ].map((module) => (
                                                    <div key={module} className="bg-gray-100 px-3 py-2 rounded border border-gray-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                        {module}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {id === "Projects" && (
                                    <div className="p-4 space-y-4">
                                        <h3 className="font-bold border-b-2 border-black pb-2">
                                            Growth Philosophy
                                        </h3>
                                        <ul className="list-disc pl-5 space-y-2 break-words">
                                            <li>Data over opinions.</li>
                                            <li>Speed of iteration is the ultimate competitive advantage.</li>
                                            <li>Brand is a multiplier on performance.</li>
                                            <li>Automation frees up creativity.</li>
                                        </ul>
                                    </div>
                                )}
                                {id === "Contact" && (
                                    <div className="p-4 space-y-4">
                                        <h3 className="font-bold border-b-2 border-black pb-2">
                                            Track Record
                                        </h3>
                                        <p className="font-bold">
                                            I've led marketing at PI firms operating at national scale and
                                            high spend.
                                        </p>
                                        <ul className="list-disc pl-5 space-y-2 text-sm break-words">
                                            <li>
                                                Drove triple-digit growth in lead volume while stabilizing
                                                cost-per-case.
                                            </li>
                                            <li>
                                                Rebuilt local search + GMB to 3x inbound volume in key
                                                markets.
                                            </li>
                                            <li>
                                                Launched brand and social programs that added tens of
                                                thousands of followers/subscribers in months.
                                            </li>
                                            <li>
                                                Led full-firm rebrands and website relaunches (strategy →
                                                design → UX → performance → CRO) on aggressive timelines.
                                            </li>
                                        </ul>
                                    </div>
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
