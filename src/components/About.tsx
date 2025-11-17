import { InteractiveQA } from "./about/InteractiveQA";
import { AvatarSection } from "./about/AvatarSection";

const About = () => {
  return (
    <section className="bg-beige py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Interactive Q&A Section */}
        <InteractiveQA />

        {/* Centered Avatar with Skill Chips */}
        <div className="max-w-5xl mx-auto mt-24 lg:mt-32">
          <AvatarSection />
        </div>
      </div>
    </section>
  );
};

export default About;
