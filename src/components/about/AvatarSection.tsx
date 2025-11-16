import { BarChart, Lightbulb, Target, Zap, MessageSquare, Layers, TrendingUp, Cog } from "lucide-react";
import { AttributeChip } from "./AttributeChip";
import { Badge } from "@/components/ui/badge";

interface Attribute {
  id: string;
  label: string;
  icon: any;
  category: string;
  position: { top: string; left?: string; right?: string };
  delay: number;
}

const ATTRIBUTES: Attribute[] = [
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart,
    category: "analytics",
    position: { top: "15%", left: "-8%" },
    delay: 0,
  },
  {
    id: "creative",
    label: "Creative",
    icon: Lightbulb,
    category: "brand",
    position: { top: "30%", left: "-5%" },
    delay: 0.2,
  },
  {
    id: "strategic",
    label: "Strategic",
    icon: Target,
    category: "brand",
    position: { top: "10%", right: "-5%" },
    delay: 0.4,
  },
  {
    id: "tactical",
    label: "Tactical",
    icon: Zap,
    category: "acquisition",
    position: { top: "28%", right: "-8%" },
    delay: 0.6,
  },
  {
    id: "communicative",
    label: "Communicative",
    icon: MessageSquare,
    category: "leadership",
    position: { top: "50%", left: "-10%" },
    delay: 0.8,
  },
  {
    id: "brand-systems",
    label: "Brand Systems",
    icon: Layers,
    category: "brand",
    position: { top: "70%", left: "-6%" },
    delay: 1.0,
  },
  {
    id: "revenue-architecture",
    label: "Revenue Architecture",
    icon: TrendingUp,
    category: "acquisition",
    position: { top: "55%", right: "-10%" },
    delay: 1.2,
  },
  {
    id: "automation",
    label: "Automation & Ops",
    icon: Cog,
    category: "ops",
    position: { top: "75%", right: "-8%" },
    delay: 1.4,
  },
];

const ATTRIBUTE_TO_CATEGORY_MAP: Record<string, string> = {
  analytics: "analytics",
  creative: "brand",
  strategic: "brand",
  tactical: "acquisition",
  communicative: "leadership",
  "brand-systems": "brand",
  "revenue-architecture": "acquisition",
  automation: "ops",
};

interface AvatarSectionProps {
  onAttributeClick: (category: string) => void;
}

export const AvatarSection = ({ onAttributeClick }: AvatarSectionProps) => {
  const handleChipClick = (attributeId: string) => {
    const category = ATTRIBUTE_TO_CATEGORY_MAP[attributeId];
    onAttributeClick(category);
    
    // Smooth scroll to skill explorer
    const skillExplorer = document.getElementById("skill-explorer");
    if (skillExplorer) {
      skillExplorer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative">
      {/* Eyebrow */}
      <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">About Dan</p>

      {/* Main Heading */}
      <h1 className="text-5xl lg:text-6xl font-bold mb-6">
        Brand architect.
        <br />
        Revenue operator.
      </h1>

      {/* Description */}
      <p className="text-lg text-muted-foreground mb-12 max-w-xl">
        I blend C-suite strategy with hands-on execution for PI firms that need both vision and
        performance. I build brands people remember, then wire the funnels, data, and systems that
        turn that attention into signed cases.
      </p>

      {/* Avatar Container with Floating Attributes */}
      <div className="relative w-full max-w-lg mx-auto lg:mx-0 aspect-[3/4] mb-12">
        {/* Placeholder Avatar */}
        <div className="relative w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">👤</div>
              <p className="text-lg text-muted-foreground font-medium">
                3D Avatar Placeholder
              </p>
              <p className="text-sm text-muted-foreground">
                Will be replaced with 3D model
              </p>
            </div>
          </div>
          
          {/* Gradient Overlays for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
        </div>

        {/* Floating Attribute Chips */}
        {ATTRIBUTES.map((attribute) => (
          <AttributeChip
            key={attribute.id}
            label={attribute.label}
            icon={attribute.icon}
            position={attribute.position}
            delay={attribute.delay}
            onClick={() => handleChipClick(attribute.id)}
          />
        ))}
      </div>

      {/* Character Stats */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="text-sm px-4 py-2">
          15+ years in PI
        </Badge>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          $XXXM+ media directed
        </Badge>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          25+ markets scaled
        </Badge>
      </div>
    </div>
  );
};
