import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-portrait.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-background flex items-center overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-7xl lg:text-8xl xl:text-9xl font-serif font-bold text-foreground leading-none">
                Dan
                <br />
                Jimmerson
              </h1>
            </div>
            
            <div className="space-y-4 max-w-lg">
              <p className="text-xl lg:text-2xl text-muted-foreground">
                Creative professional crafting
                <span className="text-accent font-semibold"> stunning experiences</span>
              </p>
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
          <div className="relative animate-slide-up">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src={heroImage}
                alt="Dan Jimmerson"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
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
      <div className="absolute bottom-1/4 left-12 w-96 h-96 bg-accent-warm/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
