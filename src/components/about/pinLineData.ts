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
    startX: 300,
    startY: 200,
    midX: 180,
    midY: 200,
    endX: 80,
    endY: 200,
    label: "Strategic Vision",
    icon: Lightbulb,
    delay: 0,
    direction: 'left'
  },
  {
    startX: 280,
    startY: 280,
    midX: 180,
    midY: 280,
    endX: 80,
    endY: 280,
    label: "Brand Builder",
    icon: Award,
    delay: 0.15,
    direction: 'left'
  },
  {
    startX: 290,
    startY: 380,
    midX: 180,
    midY: 380,
    endX: 80,
    endY: 380,
    label: "Data-Driven",
    icon: BarChart3,
    delay: 0.3,
    direction: 'left'
  },
  {
    startX: 300,
    startY: 480,
    midX: 180,
    midY: 480,
    endX: 80,
    endY: 480,
    label: "Team Leader",
    icon: Users,
    delay: 0.45,
    direction: 'left'
  },
  
  // Right Side
  {
    startX: 600,
    startY: 200,
    midX: 720,
    midY: 200,
    endX: 820,
    endY: 200,
    label: "Growth Focus",
    icon: TrendingUp,
    delay: 0.6,
    direction: 'right'
  },
  {
    startX: 620,
    startY: 280,
    midX: 720,
    midY: 280,
    endX: 820,
    endY: 280,
    label: "Innovation",
    icon: Zap,
    delay: 0.75,
    direction: 'right'
  },
  {
    startX: 610,
    startY: 380,
    midX: 720,
    midY: 380,
    endX: 820,
    endY: 380,
    label: "ROI Expert",
    icon: Target,
    delay: 0.9,
    direction: 'right'
  },
  {
    startX: 600,
    startY: 480,
    midX: 720,
    midY: 480,
    endX: 820,
    endY: 480,
    label: "Digital Marketing",
    icon: Megaphone,
    delay: 1.05,
    direction: 'right'
  }
];
