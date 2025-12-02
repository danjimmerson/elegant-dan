
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Briefcase, TrendingUp, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";
import rocketVideo from "@/assets/Rocket_Launch_Cinematic_Clip.mp4";
import racingVideo from "@/assets/Cinematic_Car_Zoom_Loop.mp4";
import flatironsVideo from "@/assets/cinematic_Flatirons_flyover.mp4";
import { DanOS } from "./DanOS/DanOS";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketVideoRef = useRef<HTMLVideoElement>(null);
  const racingVideoRef = useRef<HTMLVideoElement>(null);
  const flatironsVideoRef = useRef<HTMLVideoElement>(null);

  const isInView = useInView(containerRef, { margin: "-10% 0px -10% 0px" }); // Trigger slightly before full view

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Handle Video Playback based on visibility
  useEffect(() => {
    if (isInView) {
      rocketVideoRef.current?.play().catch(() => { });
      racingVideoRef.current?.play().catch(() => { });
      flatironsVideoRef.current?.play().catch(() => { });
    } else {
      rocketVideoRef.current?.pause();
      racingVideoRef.current?.pause();
      flatironsVideoRef.current?.pause();
    }
  }, [isInView]);

  // Background Opacity Transitions (3 Backgrounds + Contact Section)
  // 0 - 0.25: Rocket
  // 0.25 - 0.5: Racing
  // 0.5 - 0.75: Flatirons
  // 0.75 - 1.0: Contact (Black)
  const rocketOpacity = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 1, 0]);
  const racingOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]);
  const flatironsOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.85, 0.95], [0, 1, 1, 0]);

  // Ken Burns Scale Effects
  const rocketScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.1]);
  const racingScale = useTransform(scrollYProgress, [0.25, 0.65], [1.1, 1]);
  const flatironsScale = useTransform(scrollYProgress, [0.55, 0.95], [1, 1.1]);

  // Text Opacity Transitions
  // Slide 1: Vision (Rocket)
  const text1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [0, 0, -50]);

  // Slide 2: Craft (Racing)
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.45, 0.6], [0, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.3, 0.45, 0.6], [50, 0, -50]);

  // Slide 3: Summit (Flatirons)
  const text3Opacity = useTransform(scrollYProgress, [0.6, 0.75, 0.9], [0, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.6, 0.75, 0.9], [50, 0, -50]);

  // Slide 4: Connection (Contact)
  const text4Opacity = useTransform(scrollYProgress, [0.9, 0.95], [0, 1]);
  const text4Y = useTransform(scrollYProgress, [0.9, 0.95], [50, 0]);

  return (
    <section className="bg-black">
      <div ref={containerRef} className="relative h-[400vh]">
        {/* Sticky Background Container */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Slide 1 Background: Rocket */}
          <motion.div
            style={{ opacity: rocketOpacity, scale: rocketScale }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={rocketVideoRef}
              src={rocketVideo}
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-110" // Scaled up to hide edges
            />
            {/* Gradient Overlays to hide black bars - Subtle */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10" />

            <div className="absolute inset-0 bg-black/40 z-0" /> {/* Overlay for text readability */}
          </motion.div>

          {/* Slide 2 Background: Racing */}
          <motion.div
            style={{ opacity: racingOpacity, scale: racingScale }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={racingVideoRef}
              src={racingVideo}
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-110" // Scaled up to hide edges/bars
            />
            {/* Gradient Overlays to hide black bars - Subtle */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          {/* Slide 3 Background: Flatirons */}
          <motion.div
            style={{ opacity: flatironsOpacity, scale: flatironsScale }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={flatironsVideoRef}
              src={flatironsVideo}
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          {/* Gradient Overlay at bottom for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Scrolling Content */}
        <div className="relative z-10 -mt-[100vh]">

          {/* Slide 1 Content: Vision */}
          <div className="h-screen flex items-center justify-center px-6">
            <motion.div
              style={{ opacity: text1Opacity, y: text1Y }}
              className="max-w-3xl text-center text-white"
            >
              <span className="text-accent font-bold tracking-widest uppercase mb-6 block">The Vision</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                Launch Your<br />Next Big Idea
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto font-light">
                Strategy isn't just about planning; it's about trajectory. I help brands find their escape velocity in a crowded digital universe.
              </p>
            </motion.div>
          </div>

          {/* Slide 2 Content: Craft */}
          <div className="h-screen flex items-center justify-center px-6">
            <motion.div
              style={{ opacity: text2Opacity, y: text2Y }}
              className="max-w-3xl text-center text-white"
            >
              <span className="text-accent font-bold tracking-widest uppercase mb-6 block">The Craft</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                Precision Engineering<br />Meets Art
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto font-light">
                Like a Formula 1 car, a great digital product requires perfect aerodynamics. Every pixel, every interaction, every line of code is tuned for performance.
              </p>
            </motion.div>
          </div>

          {/* Slide 3 Content: Summit */}
          <div className="h-screen flex items-center justify-center px-6">
            <motion.div
              style={{ opacity: text3Opacity, y: text3Y }}
              className="max-w-3xl text-center text-white"
            >
              <span className="text-accent font-bold tracking-widest uppercase mb-6 block">The Summit</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                Rise Above<br />The Noise
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto font-light">
                In a saturated market, visibility is everything. I build ecosystems that don't just reach audiences—they captivate them, giving your brand a view from the top.
              </p>
            </motion.div>
          </div>

          {/* Slide 4 Content: Connection */}
          <div className="h-screen flex items-center justify-center px-6">
            <motion.div
              style={{ opacity: text4Opacity, y: text4Y }}
              className="max-w-3xl text-center text-white"
            >
              <span className="text-accent font-bold tracking-widest uppercase mb-6 block">The Connection</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                Let's Build<br />The Future
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto font-light mb-12">
                Ready to take the lead? Let's collaborate on something that defines the next generation of the web.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Start the Conversation <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>

      {/* The Operating System Section (DanOS) - Now outside the fixed height container */}
      <DanOS />
    </section>
  );
};

export default About;
