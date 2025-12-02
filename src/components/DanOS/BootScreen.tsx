import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
    onComplete: () => void;
}

export const BootScreen = ({ onComplete }: BootScreenProps) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const bootSequence = [
            "DAN_BIOS v2.0.24",
            `Copyright (C) ${new Date().getFullYear()} Dan Jimmerson`,
            " ",
            "Checking Memory... OK",
            "Loading Kernel... OK",
            "Initializing Growth.sys... OK",
            "Mounting Strategy Volumes... OK",
            " ",
            "Booting DanOS...",
        ];

        let delay = 0;
        bootSequence.forEach((line, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                setLines((prev) => [...prev, line]);
                if (index === bootSequence.length - 1) {
                    setTimeout(onComplete, 800);
                }
            }, delay);
        });
    }, [onComplete]);

    return (
        <div className="w-full h-full bg-black text-cream font-mono p-8 text-lg md:text-xl leading-relaxed">
            {lines.map((line, i) => (
                <div key={i}>{line}</div>
            ))}
            <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-3 h-5 bg-cream ml-1 align-middle"
            />
        </div>
    );
};
