import { useEffect } from "react";
import { qaData } from "./qaData";
import { cn } from "@/lib/utils";

interface QAContentProps {
  setActiveId: (id: string) => void;
  activeId: string;
}

export const QAContent = ({ setActiveId }: QAContentProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const id = entry.target.getAttribute('data-qa-id');
            if (id) setActiveId(id);
          }
        });
      },
      { 
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-20% 0px -50% 0px'
      }
    );
    
    // Observe all sections
    document.querySelectorAll('[data-qa-id]').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [setActiveId]);

  return (
    <div className="space-y-16 lg:space-y-24">
      {qaData.map((item, index) => (
        <div
          key={item.id}
          id={item.id}
          data-qa-id={item.id}
          className="scroll-mt-32 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={cn(
            "rounded-2xl p-8 lg:p-12 shadow-2xl transition-all duration-500 hover:shadow-orange-900/20 hover:scale-[1.01]",
            item.bgColor
          )}>
            {/* Accent Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className={cn("w-3 h-3 rounded-sm", item.accentColor)} />
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {item.label}
              </span>
            </div>
            
            {/* Large Serif Headline */}
            <h3 className="text-4xl lg:text-6xl font-serif font-bold mb-8 text-white leading-tight">
              {item.title}
            </h3>
            
            {/* Intro Paragraph */}
            <p className="text-xl lg:text-2xl font-sans mb-10 text-slate-200 leading-relaxed max-w-3xl">
              {item.intro}
            </p>
            
            {/* Bullets */}
            <ul className="space-y-4 text-base lg:text-lg max-w-3xl">
              {item.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0",
                    item.accentColor
                  )} />
                  <span className="text-slate-300 leading-relaxed">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
