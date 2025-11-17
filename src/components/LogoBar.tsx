import microsoftLogo from "@/assets/logos/microsoft.svg";
import nasaLogo from "@/assets/logos/nasa.png";
import armyLogo from "@/assets/logos/army.svg";
import vaLogo from "@/assets/logos/va.svg";
import dklawLogo from "@/assets/logos/dklaw.svg";
import astaLogo from "@/assets/logos/asta.png";
import nypdLogo from "@/assets/logos/nypd.png";

const LogoBar = () => {
  // Optimized logo order: alternating wide/narrow for visual balance
  const logos = [
    { src: nasaLogo, alt: "NASA" },           // narrow
    { src: microsoftLogo, alt: "Microsoft" }, // wide
    { src: armyLogo, alt: "U.S. Army" },      // narrow
    { src: dklawLogo, alt: "DK Law" },        // wide
    { src: vaLogo, alt: "Veterans Administration" }, // narrow
    { src: astaLogo, alt: "ASTA" },           // wide
    { src: nypdLogo, alt: "NYPD" }            // narrow
  ];

  // Triple the logos for seamless infinite scroll
  const tripleLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12">
        <p className="text-left text-xs text-muted-foreground uppercase tracking-wider mb-4">
          Brands I've worked and partnered with
        </p>
        
        {/* Scrolling Container with Fade Edges */}
        <div className="relative overflow-hidden">
          {/* Left Fade Gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          
          {/* Right Fade Gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling Logos */}
          <div className="flex items-center gap-16 lg:gap-24 animate-scroll-logos px-8">
            {tripleLogos.map((logo, index) => (
              <img
                key={`${logo.alt}-${index}`}
                src={logo.src}
                alt={logo.alt}
                className="h-6 lg:h-8 w-auto object-contain opacity-60 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoBar;
