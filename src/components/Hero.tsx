import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/dan-jimmerson-speaker.jpg";
import { useTypewriter } from "@/hooks/useTypewriter";
import LogoBar from "./LogoBar";
const Hero = () => {
  const typewriterText = useTypewriter(["Marketing Executive", "Brand Architect", "Revenue Catalyst"]);
  return <section className="relative min-h-screen bg-background flex items-center overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 py-32 lg:py-24">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 lg:space-y-6 animate-fade-in">
            <div className="space-y-4">
              {/* Greeting */}
              <p className="text-lg lg:text-xl text-foreground font-sans mb-4">
                Hi, I'm Dan Jimmerson.
              </p>
              
              {/* Typewriter Effect */}
              <h2 className="text-5xl lg:text-6xl xl:text-6xl font-sans font-bold leading-tight min-h-[4.5rem] lg:min-h-[5rem] xl:min-h-[5rem] text-foreground">
                {typewriterText}
                <span className="inline-block w-1 h-10 lg:h-12 xl:h-12 bg-accent animate-cursor-blink ml-1"></span>
              </h2>
            </div>
            
            <div className="space-y-4 max-w-lg">
              <p className="text-lg text-muted-foreground">I combine C-suite strategy with hands-on execution to build brands people remember and systems that reliably turn attention into revenue.</p>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-up z-10 lg:scale-[1.15]">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <img src={heroImage} alt="Dan Jimmerson - Professional Speaker" className="w-full h-full object-cover object-[center_45%]" loading="eager" />
              {/* Multi-layer Gradient Overlays for Seamless Transition */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Bar */}
      <div className="absolute bottom-24 left-0 right-0 z-20">
        <LogoBar />
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-30">
        <ArrowDown className="w-6 h-6 text-accent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-12 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-12 w-96 h-96 bg-accent-amber/5 rounded-full blur-3xl"></div>
    </section>;
};
export default Hero;