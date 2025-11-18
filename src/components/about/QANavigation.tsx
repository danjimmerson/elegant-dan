import { cn } from "@/lib/utils";
import { qaData } from "./qaData";

interface QANavigationProps {
  activeId: string;
  scrollToSection: (id: string) => void;
  scrollProgress: Record<string, number>;
}

export const QANavigation = ({ activeId, scrollToSection, scrollProgress }: QANavigationProps) => {
  return (
    <div className="sticky top-24 lg:top-32 h-fit">
      <div className="space-y-10">
        {qaData.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex flex-col gap-3 text-left transition-all duration-300 group w-full"
          >
            {/* Number + Label */}
            <div className="flex items-baseline gap-3">
              <span className="text-muted-foreground/60 text-sm font-mono">
                {item.number}
              </span>
              <span
                className={cn(
                  "text-sm lg:text-base transition-colors duration-300 uppercase tracking-wide",
                  activeId === item.id ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {item.label}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-[1px] bg-border/20 overflow-hidden">
              <div 
                className="h-full bg-foreground transition-all duration-300"
                style={{ width: `${scrollProgress[item.id] || 0}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
