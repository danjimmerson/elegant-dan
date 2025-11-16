import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryFilter = ({ label, isActive, onClick }: CategoryFilterProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        isActive
          ? "bg-accent text-accent-foreground shadow-md"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};
