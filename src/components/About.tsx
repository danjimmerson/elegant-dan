import { useState } from "react";
import { AvatarSection } from "./about/AvatarSection";
import { SkillExplorer } from "./about/SkillExplorer";

const About = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const handleAttributeClick = (category: string) => {
    setActiveFilter(category);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <section className="bg-beige py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
          {/* Left Column - Avatar & Attributes */}
          <AvatarSection onAttributeClick={handleAttributeClick} />

          {/* Right Column - Skill Explorer */}
          <div id="skill-explorer">
            <SkillExplorer activeFilter={activeFilter} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
