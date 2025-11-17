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
      className={`absolute bg-white/98 backdrop-blur-sm rounded-full px-6 py-3.5 border-l-[3px] ${animationClass} z-10`}
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        animationDelay: `${delay}s`,
        borderLeftColor: `hsl(var(--${accentColor}))`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-3">
        <Icon 
          size={20} 
          className="flex-shrink-0"
          style={{ color: `hsl(var(--${accentColor}))` }}
        />
        <span className="text-base font-medium tracking-tight whitespace-nowrap text-gray-900">
          {label}
        </span>
      </div>
    </div>
  );
};
