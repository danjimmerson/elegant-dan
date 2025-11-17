import { useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { SkillCard } from "./SkillCard";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  label: string;
}

interface Skill {
  id: string;
  title: string;
  summary: string;
  details: string;
  tags: string[];
  category: string;
}

const CATEGORIES: Category[] = [
  { id: "all", label: "Show All" },
  { id: "brand", label: "Brand & Positioning" },
  { id: "acquisition", label: "Acquisition & Paid Media" },
  { id: "analytics", label: "Analytics & Attribution" },
  { id: "ops", label: "Ops, Systems & Integrations" },
  { id: "leadership", label: "Leadership & Team Building" },
];

const SKILLS: Skill[] = [
  {
    id: "brand-positioning",
    title: "Brand Positioning for PI Firms",
    summary: "Reframes firms from \"one of many\" to the obvious choice in crowded markets.",
    details: "Used at DK Law and Alexander Shunnarah to scale volume while defending margins.",
    tags: ["Brand", "Strategic"],
    category: "brand",
  },
  {
    id: "full-funnel",
    title: "Full-Funnel Acquisition Strategy",
    summary: "Architects media, landing experiences, and follow-up that stabilize cost-per-case.",
    details: "Deployed across 25+ markets to reduce CPA by 30% while maintaining quality.",
    tags: ["Performance", "Acquisition"],
    category: "acquisition",
  },
  {
    id: "attribution",
    title: "Attribution & BI for Signed Cases",
    summary: "Builds reporting that ties every marketing dollar to actual case outcomes.",
    details: "Custom dashboards showing true ROI from first click to signed retainer.",
    tags: ["Analytics", "Ops"],
    category: "analytics",
  },
  {
    id: "creative-direction",
    title: "Creative Direction That Performs",
    summary: "Leads concepts that are memorable on billboards, search, and social—and actually convert.",
    details: "Balance brand storytelling with direct response principles for measurable results.",
    tags: ["Creative", "Brand"],
    category: "brand",
  },
  {
    id: "marketing-ops",
    title: "Marketing Ops & Integrations",
    summary: "Connects CRMs, call centers, and ad platforms so no lead slips through the cracks.",
    details: "Built full-stack integrations between CallRail, Salesforce, and Meta/Google APIs.",
    tags: ["Ops", "Systems"],
    category: "ops",
  },
  {
    id: "team-building",
    title: "Team Building & Leadership",
    summary: "Builds and coaches teams across media, creative, and data that can scale beyond the founder.",
    details: "Hired, trained, and led 15+ person marketing departments with clear KPIs.",
    tags: ["Leadership", "People"],
    category: "leadership",
  },
];

interface SkillExplorerProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const SkillExplorer = ({ activeFilter, onFilterChange }: SkillExplorerProps) => {
  const [showAll, setShowAll] = useState(false);

  const filteredSkills = activeFilter === "all" 
    ? SKILLS 
    : SKILLS.filter((skill) => skill.category === activeFilter);

  const displayedSkills = showAll ? filteredSkills : filteredSkills.slice(0, 4);

  return (
    <div className="bg-card rounded-2xl shadow-xl p-6 lg:p-8" id="skill-explorer">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Skillset</h2>
        <p className="text-sm text-muted-foreground">Browse how I help firms grow.</p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 snap-x scrollbar-hide">
        {CATEGORIES.map((category) => (
          <CategoryFilter
            key={category.id}
            label={category.label}
            isActive={activeFilter === category.id}
            onClick={() => {
              onFilterChange(category.id);
              setShowAll(false);
            }}
          />
        ))}
      </div>

      {/* Skill Cards - Single Column */}
      <div className="space-y-4 mb-6">
        {displayedSkills.map((skill, index) => (
          <SkillCard key={skill.id} {...skill} index={index} />
        ))}
      </div>

      {/* View Full List Button */}
      {filteredSkills.length > 4 && !showAll && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(true)}
          className="w-full text-sm"
        >
          View full skill list ({filteredSkills.length - 4} more)
        </Button>
      )}
    </div>
  );
};
