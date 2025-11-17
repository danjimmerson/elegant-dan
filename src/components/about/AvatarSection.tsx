import { AttributeChip } from "./AttributeChip";
import { BarChart, Lightbulb, Target, Zap, Users, Puzzle, Briefcase, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Attribute {
  id: string;
  label: string;
  icon: LucideIcon;
  category: string;
  position: { top: string; left: string };
  delay: number;
}

// Helper function for circular positioning (keeps chips within bounds)
const getCircularPosition = (index: number, total: number, radiusPercent: number) => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
  const x = 50 + radiusPercent * Math.cos(angle);
  const y = 50 + radiusPercent * Math.sin(angle);
  return { 
    top: `${Math.max(5, Math.min(95, y))}%`, 
    left: `${Math.max(5, Math.min(95, x))}%` 
  };
};

const ATTRIBUTES: Attribute[] = [
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart,
    category: "analytics",
    position: getCircularPosition(0, 8, 38),
    delay: 0,
  },
  {
    id: "creative",
    label: "Creative",
    icon: Lightbulb,
    category: "brand",
    position: getCircularPosition(1, 8, 38),
    delay: 0.2,
  },
  {
    id: "strategic",
    label: "Strategic",
    icon: Target,
    category: "brand",
    position: getCircularPosition(2, 8, 38),
    delay: 0.4,
  },
  {
    id: "tactical",
    label: "Tactical",
    icon: Zap,
    category: "acquisition",
    position: getCircularPosition(3, 8, 38),
    delay: 0.6,
  },
  {
    id: "leadership",
    label: "Leadership",
    icon: Users,
    category: "leadership",
    position: getCircularPosition(4, 8, 38),
    delay: 0.8,
  },
  {
    id: "systems",
    label: "Systems",
    icon: Puzzle,
    category: "ops",
    position: getCircularPosition(5, 8, 38),
    delay: 1.0,
  },
  {
    id: "ops",
    label: "Operations",
    icon: Briefcase,
    category: "ops",
    position: getCircularPosition(6, 8, 38),
    delay: 1.2,
  },
  {
    id: "growth",
    label: "Growth",
    icon: TrendingUp,
    category: "acquisition",
    position: getCircularPosition(7, 8, 38),
    delay: 1.4,
  },
];

const ATTRIBUTE_TO_CATEGORY_MAP: Record<string, string> = {
  analytics: "analytics",
  creative: "brand",
  strategic: "brand",
  tactical: "acquisition",
  leadership: "leadership",
  systems: "ops",
  ops: "ops",
  growth: "acquisition",
};

interface AvatarSectionProps {
  onAttributeClick: (category: string) => void;
}

export const AvatarSection = ({ onAttributeClick }: AvatarSectionProps) => {
  const handleChipClick = (attributeId: string) => {
    const category = ATTRIBUTE_TO_CATEGORY_MAP[attributeId] || "all";
    onAttributeClick(category);
    
    // Smooth scroll to skill explorer
    const skillExplorer = document.getElementById("skill-explorer");
    if (skillExplorer) {
      skillExplorer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Avatar Container - Centered */}
      <div className="relative w-64 h-64 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center shadow-2xl">
        <div className="text-6xl font-bold text-accent/40">DJ</div>
        <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
      </div>

      {/* Floating Attribute Chips - Positioned in circle around avatar */}
      {ATTRIBUTES.map((attr) => (
        <AttributeChip
          key={attr.id}
          label={attr.label}
          icon={attr.icon}
          position={attr.position}
          delay={attr.delay}
          onClick={() => handleChipClick(attr.id)}
        />
      ))}
    </div>
  );
};
