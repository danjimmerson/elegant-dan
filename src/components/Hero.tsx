import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/dan-jimmerson-speaker-stage-v3.jpg";
import LogoBar from "./LogoBar";
import { useTypewriter } from "@/hooks/useTypewriter";

const Hero = () => {
  const typewriterText = useTypewriter([
    "Marketing Executive",
    "Brand Architect",
    "Revenue Catalyst"
  ]);

  return (
    <section className="relative min-h-screen bg-background flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] opacity-50 animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-amber/5 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 h-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center h-full min-h-[600px]">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl z-30 pt-32 lg:pt-0"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg lg:text-xl text-muted-foreground font-medium mb-2"
            >
              Hi, I'm Dan Jimmerson.
            </motion.p>

            <h1 className="text-5xl lg:text-7xl font-sans font-bold leading-[1.1] mb-6 tracking-tight text-white min-h-[120px] lg:min-h-[160px]">
              {typewriterText}<span className="animate-cursor-blink text-accent">|</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg lg:text-xl text-muted-foreground/80 max-w-lg leading-relaxed"
            >
              I combine C-suite strategy with hands-on execution to build brands people remember and systems that reliably turn attention into revenue.
            </motion.p>
          </motion.div>

          {/* Hero Image - Seamless Blend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] h-full z-0 lg:z-10"
          >
            <div className="relative w-full h-full">
              <img
                src={heroImage}
                alt="Dan Jimmerson"
                className="w-full h-full object-cover object-[center_15%] brightness-[0.8] lg:w-auto lg:h-[115%] lg:absolute lg:top-0 lg:right-0 lg:object-cover lg:object-[center_top] lg:[mask-image:linear-gradient(to_right,transparent,black_20%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent,black_20%)]"
              />

              {/* Mobile: Bottom Gradient for Text Readability */}
              <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-t from-background via-background/90 to-transparent lg:hidden z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Logo Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background to-transparent pt-20 pb-8">
        <LogoBar />
      </div>
    </section>
  );
};

export default Hero;