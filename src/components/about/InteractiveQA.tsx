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
              className="border-b border-border"
            >
              <AccordionTrigger className="text-left font-serif text-xl lg:text-2xl font-bold hover:no-underline hover:text-accent transition-colors">
                <span className="text-muted-foreground mr-2">{item.number}</span>
                {item.label}
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                {/* Intro */}
                <p className="text-lg font-sans mb-6 text-foreground leading-relaxed">
                  {item.intro}
                </p>
                
                {/* Bullets */}
                <ul className="space-y-3 text-base">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-accent mt-1 flex-shrink-0">–</span>
                      <span className="text-muted-foreground leading-relaxed">{bullet}</span>
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
