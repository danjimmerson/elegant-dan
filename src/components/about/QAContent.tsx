import { useEffect } from "react";
import { qaData } from "./qaData";

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
    <div className="space-y-12 lg:space-y-16">
      {qaData.map((item, index) => (
        <div
          key={item.id}
          id={item.id}
          data-qa-id={item.id}
          className="group scroll-mt-32 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Premium Card */}
          <div className="bg-white/60 backdrop-blur-sm border border-border/40 rounded-3xl p-8 lg:p-12 shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] origin-top">
            
            {/* Number Badge + Title */}
            <div className="mb-8">
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm bg-foreground/10 text-foreground/70 font-medium rounded-full mb-4">
                {item.number}
              </span>
              <h3 className="text-3xl lg:text-5xl font-serif font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
            </div>
            
            {/* Intro with highlight */}
            <div className="bg-accent/5 -mx-4 px-4 py-3 rounded-xl mb-8">
              <p className="text-lg lg:text-xl font-medium leading-relaxed text-foreground/90">
                {item.intro}
              </p>
            </div>
            
            {/* Enhanced Bullets */}
            <ul className="space-y-4">
              {item.bullets.map((bullet, i) => (
                <li 
                  key={i} 
                  className="flex gap-4 items-start bg-background/40 hover:bg-background/60 p-4 rounded-xl border-l-2 border-accent/30 transition-all duration-200 hover:translate-x-1"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <span className="text-base lg:text-lg text-muted-foreground leading-relaxed">
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
