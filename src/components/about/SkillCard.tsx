import { useState } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "bg-background rounded-lg p-4 border border-border hover:border-accent transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-md opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{summary}</p>
      
      {isHovered && (
        <p className="text-xs text-muted-foreground mb-3 italic animate-fade-in">
          {details}
        </p>
      )}
      
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
