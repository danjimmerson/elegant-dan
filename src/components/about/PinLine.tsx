import { LucideIcon } from "lucide-react";

interface PinLineProps {
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
  label: string;
  icon: LucideIcon;
  delay: number;
  direction: 'left' | 'right';
}

export const PinLine = ({ 
  startX, 
  startY, 
  midX, 
  midY, 
  endX, 
  endY, 
  label, 
  icon: Icon,
  delay,
  direction 
}: PinLineProps) => {
  const pathData = `M ${startX} ${startY} L ${midX} ${midY} L ${endX} ${endY}`;
  const pathLength = Math.sqrt(
    Math.pow(midX - startX, 2) + Math.pow(midY - startY, 2)
  ) + Math.sqrt(
    Math.pow(endX - midX, 2) + Math.pow(endY - midY, 2)
  );

  return (
    <>
      {/* SVG Line */}
      <path
        d={pathData}
        stroke="black"
        strokeWidth="2"
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength}
        style={{
          animation: `draw-line 0.6s ease-out ${delay}s forwards`
        }}
      />
      
      {/* Connection Dot */}
      <circle
        cx={startX}
        cy={startY}
        r="4"
        fill="black"
        opacity="0"
        style={{
          animation: `fade-in 0.3s ease-out ${delay}s forwards`
        }}
      />

      {/* Label Badge */}
      <foreignObject
        x={direction === 'left' ? endX - 160 : endX + 10}
        y={endY - 20}
        width="150"
        height="40"
        style={{
          opacity: 0,
          animation: `fade-in-label 0.3s ease-out ${delay + 0.6}s forwards`
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-background border-2 border-foreground rounded-md shadow-md hover:scale-105 transition-transform cursor-default">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">{label}</span>
        </div>
      </foreignObject>
    </>
  );
};
