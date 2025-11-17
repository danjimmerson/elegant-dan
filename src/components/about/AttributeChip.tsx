import { LucideIcon } from "lucide-react";

interface AttributeChipProps {
  label: string;
  icon: LucideIcon;
  position: { top: string; left?: string; right?: string };
  delay: number;
  direction: 'left' | 'right';
  accentColor: string;
}

export const AttributeChip = ({ 
  label, 
  icon: Icon, 
  position, 
  delay, 
  direction,
  accentColor 
}: AttributeChipProps) => {
  const animationClass = direction === 'left' ? 'animate-slide-from-left' : 'animate-slide-from-right';
  
  return (
    <div
      className={`absolute bg-card/95 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg border-2 ${animationClass} z-20`}
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        animationDelay: `${delay}s`,
        borderColor: `hsl(var(--${accentColor}))`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <Icon 
          size={18} 
          className="flex-shrink-0"
          style={{ color: `hsl(var(--${accentColor}))` }}
        />
        <span className="text-sm font-semibold whitespace-nowrap text-card-foreground">
          {label}
        </span>
      </div>
    </div>
  );
};
