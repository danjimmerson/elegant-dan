import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DesktopIconProps {
    label: string;
    icon: string | LucideIcon;
    onClick: () => void;
    id?: string; // Add optional id to fix type error in parent
}

export const DesktopIcon = ({ label, icon: Icon, onClick }: DesktopIconProps) => {
    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center gap-2 text-white hover:bg-white/10 p-2 rounded border border-transparent hover:border-white/20 transition-colors focus:outline-none focus:bg-white/20 focus:border-white/40"
        >
            {typeof Icon === "string" ? (
                <img
                    src={Icon}
                    alt={label}
                    className="w-12 h-12 object-contain pixelated rendering-pixelated mb-1"
                    style={{ imageRendering: "pixelated" }}
                />
            ) : (
                <Icon className="w-12 h-12 text-cream mb-1" strokeWidth={1.5} />
            )}
            <span className="text-xs font-bold text-cream bg-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                {label}
            </span>
        </button>
    );
};
