import { useEffect } from "react";
import { qaData } from "./qaData";
import { Card } from "@/components/ui/card";

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
    <div className="space-y-8 lg:space-y-12">
      {qaData.map((item, index) => (
        <Card
          key={item.id}
          id={item.id}
          data-qa-id={item.id}
          className="scroll-mt-32 animate-fade-in p-8 lg:p-12 bg-card/80 backdrop-blur-sm border-border/50"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Number + Title */}
          <h3 className="text-3xl lg:text-5xl font-serif font-bold mb-6 text-foreground">
            {item.number} – {item.title}
          </h3>
          
          {/* Intro */}
          <p className="text-xl lg:text-2xl font-sans mb-8 text-foreground leading-relaxed">
            {item.intro}
          </p>
          
          {/* Bullets */}
          <ul className="space-y-4 text-base lg:text-lg">
            {item.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent mt-1 flex-shrink-0">–</span>
                <span className="text-muted-foreground leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};
