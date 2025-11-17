import { cn } from "@/lib/utils";
import { qaData } from "./qaData";

interface QANavigationProps {
  activeId: string;
  scrollToSection: (id: string) => void;
}

export const QANavigation = ({ activeId, scrollToSection }: QANavigationProps) => {
  return (
    <nav className="sticky top-24 lg:top-32 h-fit">
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 shadow-md border border-amber-100">
        <div className="space-y-1">
          {qaData.map((item, index) => (
            <div key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "w-full text-left py-4 px-4 -mx-4 rounded-md transition-all duration-300 group",
                  activeId === item.id 
                    ? "bg-amber-100/80" 
                    : "hover:bg-amber-50/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-lg font-bold transition-colors duration-300",
                      activeId === item.id 
                        ? "text-orange-600" 
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  >
                    {item.number}
                  </span>
                  <span
                    className={cn(
                      "text-xs uppercase tracking-wider font-medium transition-colors duration-300",
                      activeId === item.id 
                        ? "text-slate-900" 
                        : "text-slate-600 group-hover:text-slate-800"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
              
              {index < qaData.length - 1 && (
                <div className="h-px bg-amber-200 my-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
