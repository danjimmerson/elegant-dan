import { useEffect } from "react";
import { qaData } from "./qaData";
import deskApproachImage from "@/assets/desk-approach.jpg";
import rocketLaunchImage from "@/assets/rocket-launch-growth.jpg";

// Map each Q&A section to its hero image
const heroImages: Record<string, string> = {
  "what-i-do": deskApproachImage,
  "how-i-think": rocketLaunchImage,
  "proof-it-works": deskApproachImage,
  "working-on-now": deskApproachImage,
};

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
          className="relative scroll-mt-32 animate-fade-in bg-white overflow-hidden shadow-lg"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Hero Image - Full Bleed */}
          <div className="relative w-full h-64 lg:h-80 overflow-hidden">
            <img 
              src={heroImages[item.id] || deskApproachImage} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Black Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <h3 className="text-3xl lg:text-5xl font-sans font-bold text-white">
                {item.number} – {item.title}
              </h3>
            </div>
          </div>
          
          {/* Card Content */}
          <div className="p-8 lg:p-12 relative">
            {/* Intro */}
            <p className="text-xl lg:text-2xl font-sans mb-8 text-gray-800 leading-relaxed">
              {item.intro}
            </p>
            
            {/* Bullets */}
            <ul className="space-y-4 text-base lg:text-lg">
              {item.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-gray-900 mt-1 flex-shrink-0">–</span>
                  <span className="text-gray-700 leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Pin Line Border - Overlays Everything */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              border: '1px solid rgba(0, 0, 0, 0.3)',
              margin: '8px'
            }}
          />
        </div>
      ))}
    </div>
  );
};
