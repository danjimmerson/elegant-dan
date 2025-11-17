import { 
  Target,
  TrendingUp, 
  BarChart3, 
  Lightbulb, 
  Settings,
  Users,
  LucideIcon 
} from "lucide-react";

export interface AttributeData {
  label: string;
  icon: LucideIcon;
  position: { top: string; left?: string; right?: string };
  delay: number;
  direction: 'left' | 'right';
}

export const attributeData: AttributeData[] = [
  // Left Side
  {
    label: "Brand Positioning",
    icon: Target,
    position: { top: '15%', left: '2%' },
    delay: 0,
    direction: 'left'
  },
  {
    label: "Attribution & BI",
    icon: BarChart3,
    position: { top: '40%', left: '2%' },
    delay: 0.2,
    direction: 'left'
  },
  {
    label: "Marketing Ops & Integrations",
    icon: Settings,
    position: { top: '65%', left: '2%' },
    delay: 0.4,
    direction: 'left'
  },
  
  // Right Side
  {
    label: "Full-Funnel Acquisition",
    icon: TrendingUp,
    position: { top: '15%', right: '2%' },
    delay: 0.6,
    direction: 'right'
  },
  {
    label: "Creative Direction",
    icon: Lightbulb,
    position: { top: '40%', right: '2%' },
    delay: 0.8,
    direction: 'right'
  },
  {
    label: "Team Building & Leadership",
    icon: Users,
    position: { top: '65%', right: '2%' },
    delay: 1.0,
    direction: 'right'
  }
];
