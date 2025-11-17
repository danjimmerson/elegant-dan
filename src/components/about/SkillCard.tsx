import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  title: string;
  summary: string;
  details: string;
  tags: string[];
  index: number;
}

export const SkillCard = ({ title, summary, details, tags, index }: SkillCardProps) => {
  return (
    <div
      className={cn(
        "bg-background rounded-lg p-6 border-2 border-border hover:border-accent transition-all duration-300",
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
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
