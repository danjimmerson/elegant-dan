import { cn } from "@/lib/utils";
import { qaData } from "./qaData";

interface QANavigationProps {
  activeId: string;
  scrollToSection: (id: string) => void;
}

export const QANavigation = ({ activeId, scrollToSection }: QANavigationProps) => {
  return (
    <div className="sticky top-24 lg:top-32 h-fit">
      {/* Container with subtle background */}
      <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm p-6">
        {/* Gradient vertical line */}
        <div className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-border/20 via-border to-border/20" />
        
        {/* Refined stops */}
        <div className="relative space-y-14">
          {qaData.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-center gap-4 text-left transition-all duration-300 group w-full",
                activeId === item.id ? "font-semibold" : "font-normal"
              )}
            >
              {/* Enhanced Dot */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full border transition-all duration-300 flex-shrink-0",
                  activeId === item.id
                    ? "bg-gradient-to-br from-foreground to-foreground/80 border-foreground shadow-md shadow-foreground/10 scale-110"
                    : "bg-white/80 border-border/60 shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:border-foreground/80 group-hover:bg-white"
                )}
              />
              
              {/* Label */}
              <span
                className={cn(
                  "text-[15px] lg:text-base tracking-tight transition-all duration-300",
                  activeId === item.id 
                    ? "text-foreground" 
                    : "text-muted-foreground group-hover:text-foreground group-hover:translate-x-1"
                )}
              >
                {item.number} · {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
