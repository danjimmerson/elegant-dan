import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Feed from "@/components/Feed";
import WorkPlay from "@/components/WorkPlay";
import Contact from "@/components/Contact";
import MarketingChapter from "@/components/MarketingChapter";
import { DanOS } from "@/components/DanOS/DanOS";

// Assets
import rocketVideo from "@/assets/Rocket_Launch_Cinematic_Clip.mp4";
import racingVideo from "@/assets/Cinematic_Car_Zoom_Loop.mp4";
import flatironsVideo from "@/assets/cinematic_Flatirons_flyover.mp4";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background dark">
      <Navigation />
      <Hero />
      <Testimonials />

      {/* Chapter 1: The Vision */}
      <MarketingChapter
        videoSrc={rocketVideo}
        subtitle="Growth & Go-to-Market"
        title={<>Ignite Your<br />Trajectory</>}
        description="In a world of stagnation, growth is the only metric that matters. I architect Go-to-Market strategies that cut through the noise, leveraging AI-driven insights to launch your brand into a new orbit of revenue."
      />

      <div id="about">
        <DanOS />
      </div>

      <Feed />

      {/* Chapter 2: The Craft */}
      <MarketingChapter
        videoSrc={racingVideo}
        subtitle="Performance & Operations"
        title={<>Engineered for<br />Velocity</>}
        description="Marketing isn't just art; it's physics. I fine-tune your revenue engine with data-driven precision, optimizing CAC, LTV, and conversion rates like a Formula 1 team. Maximum output, zero drag."
      />

      <div id="work">
        <WorkPlay />
      </div>

      {/* Chapter 3: The Summit */}
      <MarketingChapter
        videoSrc={flatironsVideo}
        subtitle="Brand Strategy & Vision"
        title={<>Command The<br />Landscape</>}
        description="True leadership is about perspective. I help companies define their North Star, aligning brand narrative with market reality to build enduring authority. Don't just compete. Dominate the view."
        showCta={true}
      />

      <div id="contact">
        <Contact />
      </div>
    </div>
  );
};

export default Index;
