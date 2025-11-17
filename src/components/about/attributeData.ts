import { 
  Lightbulb, 
  Award, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Zap, 
  Target, 
  Megaphone,
  LucideIcon 
} from "lucide-react";

export interface AttributeData {
  label: string;
  icon: LucideIcon;
  position: { top: string; left?: string; right?: string };
  delay: number;
  direction: 'left' | 'right';
  accentColor: string;
}

export const attributeData: AttributeData[] = [
  // Left Side
  {
    label: "Strategic Vision",
    icon: Lightbulb,
    position: { top: '12%', left: '2%' },
    delay: 0,
    direction: 'left',
    accentColor: 'accent'
  },
  {
    label: "Brand Builder",
    icon: Award,
    position: { top: '32%', left: '1%' },
    delay: 0.15,
    direction: 'left',
    accentColor: 'accent-lavender'
  },
  {
    label: "Data-Driven",
    icon: BarChart3,
    position: { top: '52%', left: '3%' },
    delay: 0.3,
    direction: 'left',
    accentColor: 'accent-jungle'
  },
  {
    label: "Team Leader",
    icon: Users,
    position: { top: '72%', left: '2%' },
    delay: 0.45,
    direction: 'left',
    accentColor: 'accent-tangerine'
  },
  
  // Right Side
  {
    label: "Growth Focus",
    icon: TrendingUp,
    position: { top: '12%', right: '2%' },
    delay: 0.6,
    direction: 'right',
    accentColor: 'accent-jungle'
  },
  {
    label: "Innovation",
    icon: Zap,
    position: { top: '32%', right: '1%' },
    delay: 0.75,
    direction: 'right',
    accentColor: 'accent-amber'
  },
  {
    label: "ROI Expert",
    icon: Target,
    position: { top: '52%', right: '3%' },
    delay: 0.9,
    direction: 'right',
    accentColor: 'accent-copper'
  },
  {
    label: "Digital Marketing",
    icon: Megaphone,
    position: { top: '72%', right: '2%' },
    delay: 1.05,
    direction: 'right',
    accentColor: 'accent'
  }
];
