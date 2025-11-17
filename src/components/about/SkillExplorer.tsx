import { Sparkles } from "lucide-react";
import { SkillCard } from "./SkillCard";

interface Skill {
  id: string;
  title: string;
  outcome: string;
  tags: string[];
}

const SKILLS: Skill[] = [
  {
    id: "brand-positioning",
    title: "Brand Positioning",
    outcome: "Made firms the obvious choice in crowded markets",
    tags: ["Brand", "Strategic"],
  },
  {
    id: "full-funnel",
    title: "Full-Funnel Acquisition",
    outcome: "Reduced cost-per-case by 30% across 25+ markets",
    tags: ["Performance", "Acquisition"],
  },
  {
    id: "attribution",
    title: "Attribution & BI",
    outcome: "Built dashboards showing true ROI from click to signed case",
    tags: ["Analytics", "Ops"],
  },
  {
    id: "creative-direction",
    title: "Creative Direction",
    outcome: "Delivered concepts that are memorable and convert",
    tags: ["Creative", "Brand"],
  },
  {
    id: "marketing-ops",
    title: "Marketing Ops & Integrations",
    outcome: "Connected CRMs, call centers, and ad platforms seamlessly",
    tags: ["Ops", "Systems"],
  },
  {
    id: "team-building",
    title: "Team Building & Leadership",
    outcome: "Built and coached teams that scale beyond the founder",
    tags: ["Leadership", "People"],
  },
];

export const SkillExplorer = () => {
  return (
    <div className="bg-accent-tangerine rounded-2xl shadow-xl p-6 lg:p-8" id="skill-explorer">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Core Capabilities</h2>
            <p className="text-xs text-white/90">What I bring to your firm</p>
          </div>
        </div>
      </div>

      {/* Skill Cards - 2x3 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SKILLS.map((skill, index) => (
          <SkillCard key={skill.id} {...skill} index={index} />
        ))}
      </div>
    </div>
  );
};
