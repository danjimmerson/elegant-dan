import { LucideIcon } from "lucide-react";

interface AttributeChipProps {
  label: string;
  icon: LucideIcon;
  position: { top: string; left: string };
  delay: number;
  onClick: () => void;
}

export const AttributeChip = ({ label, icon: Icon, position, delay, onClick }: AttributeChipProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute bg-accent text-accent-foreground rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 animate-float"
      style={{
        top: position.top,
        left: position.left,
        animationDelay: `${delay}s`,
        transform: "translate(-50%, -50%)", // Center the chip on its position
      }}
      aria-label={`Filter by ${label}`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
      </div>
    </button>
  );
};
