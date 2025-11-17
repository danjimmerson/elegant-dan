import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  title: string;
  summary: string;
  details: string;
  tags: string[];
  index: number;
}

const TAG_COLORS: Record<string, string> = {
  // Brand/Creative
  "Brand": "bg-accent/20 text-accent-foreground border-accent/40",
  "Creative": "bg-purple-500/20 text-purple-700 border-purple-500/40",
  "Strategic": "bg-emerald-500/20 text-emerald-700 border-emerald-500/40",
  
  // Performance/Ops
  "Performance": "bg-orange-500/20 text-orange-700 border-orange-500/40",
  "Acquisition": "bg-accent/20 text-accent-foreground border-accent/40",
  "Ops": "bg-blue-500/20 text-blue-700 border-blue-500/40",
  "Systems": "bg-cyan-500/20 text-cyan-700 border-cyan-500/40",
  
  // Data/Analytics
  "Analytics": "bg-violet-500/20 text-violet-700 border-violet-500/40",
  
  // People/Leadership
  "Leadership": "bg-green-500/20 text-green-700 border-green-500/40",
  "People": "bg-teal-500/20 text-teal-700 border-teal-500/40",
};

const getTagColor = (tag: string) => {
  return TAG_COLORS[tag] || "bg-accent/20 text-accent-foreground border-accent/40";
};

export const SkillCard = ({ title, summary, details, tags, index }: SkillCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg p-6 border-2 border-border/50 hover:border-accent transition-all duration-300",
        "hover:shadow-md opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-base text-muted-foreground mb-3">{summary}</p>
      <p className="text-sm text-muted-foreground/80 mb-4 italic">
        {details}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge 
            key={tag} 
            variant="outline"
            className={cn("text-xs font-medium border", getTagColor(tag))}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
