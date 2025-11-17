import microsoftLogo from "@/assets/logos/microsoft.svg";
import nasaLogo from "@/assets/logos/nasa.png";
import armyLogo from "@/assets/logos/army.svg";
import vaLogo from "@/assets/logos/va.svg";
import dklawLogo from "@/assets/logos/dklaw.svg";
import astaLogo from "@/assets/logos/asta.png";
import nypdLogo from "@/assets/logos/nypd.png";

const LogoBar = () => {
  const logos = [
    { src: microsoftLogo, alt: "Microsoft" },
    { src: nasaLogo, alt: "NASA" },
    { src: armyLogo, alt: "U.S. Army" },
    { src: vaLogo, alt: "Veterans Administration" },
    { src: dklawLogo, alt: "DK Law" },
    { src: astaLogo, alt: "ASTA" },
    { src: nypdLogo, alt: "NYPD" }
  ];

  return (
    <div className="w-full">
      <div className="container mx-auto px-6 lg:px-12">
        <p className="text-left text-xs text-muted-foreground uppercase tracking-wider mb-6">
          Brands I've worked and partnered with
        </p>
        <div className="flex flex-wrap items-center justify-start gap-12 lg:gap-20">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="h-6 lg:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoBar;
