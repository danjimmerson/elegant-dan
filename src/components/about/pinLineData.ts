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

export interface PinLineData {
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

export const pinLineData: PinLineData[] = [
  // Left Side
  {
    startX: 280,
    startY: 150,
    midX: 150,
    midY: 150,
    endX: 50,
    endY: 150,
    label: "Strategic Vision",
    icon: Lightbulb,
    delay: 0,
    direction: 'left'
  },
  {
    startX: 260,
    startY: 250,
    midX: 150,
    midY: 250,
    endX: 50,
    endY: 250,
    label: "Brand Builder",
    icon: Award,
    delay: 0.15,
    direction: 'left'
  },
  {
    startX: 270,
    startY: 350,
    midX: 150,
    midY: 350,
    endX: 50,
    endY: 350,
    label: "Data-Driven",
    icon: BarChart3,
    delay: 0.3,
    direction: 'left'
  },
  {
    startX: 280,
    startY: 450,
    midX: 150,
    midY: 450,
    endX: 50,
    endY: 450,
    label: "Team Leader",
    icon: Users,
    delay: 0.45,
    direction: 'left'
  },
  
  // Right Side
  {
    startX: 420,
    startY: 150,
    midX: 550,
    midY: 150,
    endX: 650,
    endY: 150,
    label: "Growth Focus",
    icon: TrendingUp,
    delay: 0.6,
    direction: 'right'
  },
  {
    startX: 440,
    startY: 250,
    midX: 550,
    midY: 250,
    endX: 650,
    endY: 250,
    label: "Innovation",
    icon: Zap,
    delay: 0.75,
    direction: 'right'
  },
  {
    startX: 430,
    startY: 350,
    midX: 550,
    midY: 350,
    endX: 650,
    endY: 350,
    label: "ROI Expert",
    icon: Target,
    delay: 0.9,
    direction: 'right'
  },
  {
    startX: 420,
    startY: 450,
    midX: 550,
    midY: 450,
    endX: 650,
    endY: 450,
    label: "Digital Marketing",
    icon: Megaphone,
    delay: 1.05,
    direction: 'right'
  }
];
