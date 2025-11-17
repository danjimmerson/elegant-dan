import { LucideIcon } from "lucide-react";

interface AttributeChipProps {
  label: string;
  icon: LucideIcon;
  position: { top: string; left?: string; right?: string };
  delay: number;
  direction: 'left' | 'right';
}

export const AttributeChip = ({ 
  label, 
  icon: Icon, 
  position, 
  delay, 
  direction
}: AttributeChipProps) => {
  const animationClass = direction === 'left' ? 'animate-slide-from-left' : 'animate-slide-from-right';
  
  return (
    <div
      className={`absolute bg-white backdrop-blur-sm rounded-full px-6 py-3.5 border border-gray-200/60 ${animationClass} z-10`}
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        animationDelay: `${delay}s`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-3">
        <Icon 
          size={20} 
          className="flex-shrink-0 text-gray-700"
        />
        <span className="text-base font-medium tracking-tight whitespace-nowrap text-gray-900">
          {label}
        </span>
      </div>
    </div>
  );
};
