import { useState } from "react";
import { QANavigation } from "./QANavigation";
import { QAContent } from "./QAContent";
import { qaData } from "./qaData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const InteractiveQA = () => {
  const [activeId, setActiveId] = useState(qaData[0].id);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-full">
      {/* Desktop: Two-column layout */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Navigation - Sticky */}
        <div className="lg:col-span-3">
          <QANavigation 
            activeId={activeId} 
            scrollToSection={scrollToSection}
          />
        </div>
        
        {/* Right Content */}
        <div className="lg:col-span-9">
          <QAContent 
            setActiveId={setActiveId}
            activeId={activeId}
          />
        </div>
      </div>

      {/* Mobile: Accordion */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible className="space-y-4">
          {qaData.map((item) => (
            <AccordionItem 
              key={item.id} 
              value={item.id}
              className="bg-white/60 backdrop-blur-sm border border-border/40 rounded-2xl overflow-hidden shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 text-left font-serif text-xl font-bold hover:no-underline hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 text-sm bg-foreground/10 text-foreground/70 font-medium rounded-full">
                    {item.number}
                  </span>
                  <span>{item.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {/* Intro with highlight */}
                <div className="bg-accent/5 -mx-2 px-2 py-3 rounded-xl mb-6">
                  <p className="text-lg font-medium leading-relaxed text-foreground/90">
                    {item.intro}
                  </p>
                </div>
                
                {/* Enhanced Bullets */}
                <ul className="space-y-3">
                  {item.bullets.map((bullet, i) => (
                    <li 
                      key={i} 
                      className="flex gap-3 items-start bg-background/40 p-3 rounded-xl border-l-2 border-accent/30"
                    >
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span className="text-base text-muted-foreground leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
