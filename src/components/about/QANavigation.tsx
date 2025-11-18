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
              <span className={cn(
                "text-sm font-mono transition-colors duration-300",
                activeId === item.id ? "text-black" : "text-muted-foreground/60"
              )}>
                {item.number}
              </span>
              <span
                className={cn(
                  "text-sm lg:text-base transition-colors duration-300 uppercase tracking-wide",
                  activeId === item.id ? "text-black font-medium" : "text-muted-foreground group-hover:text-black"
                )}
              >
                {item.label}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className={cn(
              "w-full h-[2px] overflow-hidden transition-all duration-300 rounded-full",
              activeId === item.id ? "bg-black shadow-[0_0_8px_rgba(0,0,0,0.3)]" : "bg-border/20"
            )}>
              <div 
                className="h-full bg-accent transition-all duration-300 shadow-[0_0_10px_hsl(var(--accent))]"
                style={{ width: `${scrollProgress[item.id] || 0}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
