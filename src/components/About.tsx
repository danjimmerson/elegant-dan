import { AboutHeader } from "./about/AboutHeader";
import { AvatarSection } from "./about/AvatarSection";

const About = () => {
  return (
    <section className="bg-beige py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Full Width */}
        <AboutHeader />

        {/* Centered Avatar with Skill Chips */}
        <div className="max-w-5xl mx-auto">
          <AvatarSection />
        </div>
      </div>
    </section>
  );
};

export default About;
