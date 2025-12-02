import { useState, useEffect, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { X, Minus, Square, GripHorizontal } from "lucide-react";

interface WindowProps {
    id: string;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    onClose: () => void;
    onFocus: () => void;
    initialWidth?: number;
    initialHeight?: number;
}

export const Window = ({ id, title, children, isActive, onClose, onFocus, initialWidth, initialHeight }: WindowProps) => {
    const [size, setSize] = useState({
        width: typeof window !== "undefined" ? Math.min(initialWidth || 600, window.innerWidth * 0.95) : initialWidth || 600,
        height: typeof window !== "undefined" ? Math.min(initialHeight || 400, window.innerHeight * 0.8) : initialHeight || 400
    });
    const [isResizing, setIsResizing] = useState(false);
    const windowRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    useEffect(() => {
        const handleResize = () => {
            setSize(prev => ({
                width: Math.min(prev.width, window.innerWidth * 0.95),
                height: Math.min(prev.height, window.innerHeight * 0.8)
            }));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            // Calculate new size based on mouse position relative to window top-left
            if (windowRef.current) {
                const rect = windowRef.current.getBoundingClientRect();
                const newWidth = e.clientX - rect.left;
                const newHeight = e.clientY - rect.top;

                setSize({
                    width: Math.max(300, newWidth), // Min width
                    height: Math.max(200, newHeight) // Min height
                });
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = "default";
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "nwse-resize";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    return (
        <motion.div
            ref={windowRef}
            drag
            dragMomentum={false}
            dragListener={false} // Disable default drag listener
            dragControls={dragControls} // Use manual controls
            initial={{ x: "-50%", y: "-45%", scale: 0.9, opacity: 0 }}
            animate={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onMouseDown={onFocus}
            className={`absolute bg-cream border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col ${isActive ? "z-40" : "z-30"
                }`}
            style={{
                width: `${size.width}px`,
                height: `${size.height}px`,
                maxWidth: "95vw",
                maxHeight: "85vh",
                top: "50%",
                left: "50%"
            }}
        >
            {/* Title Bar */}
            <div
                onPointerDown={(e) => dragControls.start(e)}
                className={`flex items-center justify-between px-2 py-2 border-b-2 border-black shrink-0 cursor-move ${isActive ? "bg-black text-cream" : "bg-gray-300 text-black"
                    }`}
            >
                <span className="font-bold text-sm tracking-widest uppercase truncate font-mono select-none">
                    {title}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className={`w-6 h-6 flex items-center justify-center border-2 border-current hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors ${isActive ? "text-white border-white bg-black" : "text-black border-black"}`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-cream overflow-auto text-black font-mono relative">
                <div className="p-4 h-full">
                    {children}
                </div>
            </div>

            {/* Resize Handle */}
            <div
                className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize flex items-end justify-end p-1.5 z-50 group"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsResizing(true);
                }}
            >
                <div className="w-full h-full flex items-end justify-end">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                        <path d="M12 0V12H0L12 0Z" fill="black" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
};
