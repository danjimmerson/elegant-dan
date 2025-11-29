import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/dan-jimmerson-speaker-stage.jpeg";
import { useTypewriter } from "@/hooks/useTypewriter";
import LogoBar from "./LogoBar";
const Hero = () => {
  const typewriterText = useTypewriter(["Marketing Executive", "Brand Architect", "Revenue Catalyst"]);
  return <section className="relative min-h-screen bg-background flex items-center overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 py-24 lg:py-16 xl:py-20">
        <div className="relative">
          {/* Image - Absolutely Positioned Behind */}
          <div className="absolute right-0 top-[55%] -translate-y-1/2 w-full lg:w-1/2 xl:w-[45%] h-[500px] lg:h-[600px] z-0 animate-slide-up">
            <div className="relative w-full h-full rounded-3xl overflow-hidden lg:scale-[1.15] origin-center">
              <img src={heroImage} alt="Dan Jimmerson - Professional Speaker" className="w-full h-full object-cover object-[center_30%]" loading="eager" />
              {/* Multi-layer Gradient Overlays for Seamless Transition */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Text Content - Overlays Image */}
          <div className="relative z-10 max-w-3xl animate-fade-in">
            <p className="text-lg lg:text-xl text-foreground font-sans mb-3">
              Hi, I'm Dan Jimmerson.
            </p>
            
            <h2 className="text-5xl lg:text-6xl xl:text-6xl font-sans font-bold leading-tight min-h-[4.5rem] lg:min-h-[5rem] xl:min-h-[5rem] text-foreground lg:whitespace-nowrap mb-6 lg:mb-8">
              {typewriterText}
              <span className="inline-block w-1 h-10 lg:h-12 xl:h-12 bg-accent animate-cursor-blink ml-1"></span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              I combine C-suite strategy with hands-on execution to build brands people remember and systems that reliably turn attention into revenue.
            </p>
          </div>
        </div>
      </div>

      {/* Logo Bar */}
      <div className="absolute bottom-16 lg:bottom-20 left-0 right-0 z-20">
        <LogoBar />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-12 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-12 w-96 h-96 bg-accent-amber/5 rounded-full blur-3xl"></div>
    </section>;
};
export default Hero;