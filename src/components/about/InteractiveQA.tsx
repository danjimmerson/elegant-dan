import { useState } from "react";
import { QANavigation } from "./QANavigation";
import { QAContent } from "./QAContent";
import { qaData } from "./qaData";
import { cn } from "@/lib/utils";
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
        <Accordion type="single" collapsible className="space-y-6">
          {qaData.map((item) => (
            <AccordionItem 
              key={item.id} 
              value={item.id}
              className={cn(
                "border-none rounded-2xl overflow-hidden shadow-xl",
                item.bgColor
              )}
            >
              <AccordionTrigger className="text-left px-6 py-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0",
                    item.accentColor
                  )}>
                    {item.number}
                  </span>
                  <span className="font-serif text-xl font-bold text-white">
                    {item.label}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-lg font-sans mb-6 text-slate-200 leading-relaxed">
                  {item.intro}
                </p>
                
                <ul className="space-y-3 text-base">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                        item.accentColor
                      )} />
                      <span className="text-slate-300 leading-relaxed">{bullet}</span>
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
