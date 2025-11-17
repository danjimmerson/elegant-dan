import { AboutHeader } from "./about/AboutHeader";
import { AvatarSection } from "./about/AvatarSection";
import { SkillExplorer } from "./about/SkillExplorer";

const About = () => {
  return (
    <section className="bg-beige py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Full Width */}
        <AboutHeader />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Avatar & Attributes */}
          <AvatarSection onAttributeClick={() => {}} />

          {/* Right Column - Skill Explorer */}
          <SkillExplorer />
        </div>
      </div>
    </section>
  );
};

export default About;
