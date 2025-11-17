import { cn } from "@/lib/utils";
import { qaData } from "./qaData";

interface QANavigationProps {
  activeId: string;
  scrollToSection: (id: string) => void;
}

export const QANavigation = ({ activeId, scrollToSection }: QANavigationProps) => {
  return (
    <div className="sticky top-24 lg:top-32 h-fit">
      {/* Vertical Line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
      
      {/* Stops */}
      <div className="relative space-y-12">
        {qaData.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={cn(
              "flex items-center gap-4 text-left transition-all duration-300 group",
              activeId === item.id ? "font-bold" : "font-normal hover:translate-x-1"
            )}
          >
            {/* Dot */}
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all duration-300 flex-shrink-0",
                activeId === item.id
                  ? "bg-foreground border-foreground scale-110"
                  : "bg-background border-foreground group-hover:border-accent"
              )}
            />
            
            {/* Label */}
            <span
              className={cn(
                "text-sm lg:text-base transition-colors duration-300",
                activeId === item.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {item.number} · {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
