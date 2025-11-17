import { Badge } from "@/components/ui/badge";

export const AboutHeader = () => {
  return (
    <div className="text-center lg:text-left mb-12">
      <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
        About Dan
      </p>
      <h2 className="text-4xl lg:text-5xl font-bold mb-4">
        Brand architect. Revenue operator.
      </h2>
      <p className="text-lg text-muted-foreground max-w-3xl mb-6">
        I blend C-suite strategy with hands-on execution for PI firms that need both vision and performance. 
        I build brands people remember, then wire the funnels, data, and systems that turn that attention into signed cases.
      </p>
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        <Badge variant="secondary" className="text-sm px-4 py-2">
          15+ years in PI
        </Badge>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          $XXXM+ media directed
        </Badge>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          25+ markets scaled
        </Badge>
      </div>
    </div>
  );
};
