import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/dan-jimmerson-speaker.jpg";
import { useTypewriter } from "@/hooks/useTypewriter";

const Hero = () => {
  const typewriterText = useTypewriter([
    "Marketing Executive",
    "Personal Injury Thought Leader",
    "Marketing Technologist",
  ]);
  return (
    <section className="relative min-h-screen bg-background flex items-center overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 py-32 lg:py-24">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 lg:space-y-6 animate-fade-in">
            <div className="space-y-4">
              {/* Greeting */}
              <p className="text-lg lg:text-xl text-foreground font-sans mb-4">
                Hi, I'm Dan.
              </p>
              
              {/* Typewriter Effect */}
              <h2 
                className="text-5xl lg:text-6xl xl:text-6xl font-sans font-bold leading-tight min-h-[4.5rem] lg:min-h-[5rem] xl:min-h-[5rem] bg-clip-text text-transparent animate-rainbow-gradient"
                style={{
                  backgroundImage: "linear-gradient(to right, hsl(var(--accent)), hsl(var(--accent-tangerine)), hsl(var(--accent-copper)), hsl(var(--accent-lavender)), hsl(var(--accent-jungle)), hsl(var(--accent-amber)), hsl(var(--accent)))",
                  backgroundSize: "200% 100%",
                }}
              >
                {typewriterText}
                <span className="inline-block w-1 h-10 lg:h-12 xl:h-12 bg-accent animate-cursor-blink ml-1"></span>
              </h2>
            </div>
            
            <div className="space-y-4 max-w-lg">
              <p className="text-lg text-muted-foreground">
                Based in the heart of innovation, bringing ideas to life through design and creativity.
              </p>
            </div>

            {/* Scroll Indicator */}
            <div className="flex items-center gap-4 pt-8">
              <div className="h-px w-16 bg-accent"></div>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Scroll to explore</span>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-up z-10">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src={heroImage}
                alt="Dan Jimmerson - Professional Speaker"
                className="w-full h-full object-cover object-[center_20%] lg:scale-[1.15]"
                loading="eager"
              />
              {/* Multi-layer Gradient Overlays for Seamless Transition */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-full p-6 shadow-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-xs uppercase tracking-wider">Years</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-accent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-12 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-12 w-96 h-96 bg-accent-amber/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
