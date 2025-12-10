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
                                    <div className="p-6 h-full overflow-y-auto">
                                        <h3 className="font-bold border-b-2 border-black pb-2 mb-6 uppercase tracking-widest text-sm sticky top-0 bg-[#E0E0E0] pt-2">
                                            Growth Philosophy
                                        </h3>
                                        <div className="space-y-6">
                                            {[
                                                { title: "1. Speed is Strategy.", desc: "In a digital world, the fastest learner wins. Perfection is the enemy of profit; we ship, learn, and pivot immediately." },
                                                { title: "2. Push Unreasonable Hospitality.", desc: "Service isn't a line item; it's a memory maker. We don't just solve problems; we curate unexpected moments of delight that turn customers into fanatics." },
                                                { title: "3. Clarity Trumps Persuasion.", desc: "A confused prospect never buys. We stop trying to be clever with words and start being impossible to misunderstand." },
                                                { title: "4. Test, Don't Guess.", desc: "The market is the only opinion that matters. We leave our egos at the door and let the data dictate the direction." },
                                                { title: "5. The Offer > The Ads.", desc: "No amount of brilliant copywriting can fix a bad product. We solve the value equation first so the marketing becomes easy." },
                                                { title: "6. Simplicity Scales.", desc: "Complex funnels break; simple systems compound. We strip away the noise until only the essential remains." },
                                                { title: "7. Volume Negates Luck.", desc: "You don't need to be the smartest person in the room if you take 10x more swings than everyone else. We outwork the variance." },
                                                { title: "8. Friction Kills Deals.", desc: "The biggest competitor isn't another company; it's the customer's effort. Every extra click or second of load time is a barrier we must remove." },
                                                { title: "9. Inputs Over Outcomes.", desc: "We can't control the revenue (lag), only the daily actions (lead) that create it. Obsess over the work, and the numbers take care of themselves." },
                                                { title: "10. Give First, Ask Later.", desc: "Radical generosity builds authority faster than any sales pitch. We provide value upfront so the \"ask\" feels like a natural next step." }
                                            ].map((item, i) => (
                                                <div key={i} className="break-words">
                                                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                                    <p className="text-sm text-gray-700 leading-relaxed font-sans">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
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
