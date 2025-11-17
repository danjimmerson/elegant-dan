import microsoftLogo from "@/assets/logos/microsoft.svg";
import nasaLogo from "@/assets/logos/nasa.svg";
import armyLogo from "@/assets/logos/army.svg";
import shunnarahLogo from "@/assets/logos/shunnarah.svg";
import dklawLogo from "@/assets/logos/dklaw.svg";

const LogoBar = () => {
  const logos = [
    { src: microsoftLogo, alt: "Microsoft" },
    { src: nasaLogo, alt: "NASA" },
    { src: armyLogo, alt: "U.S. Army" },
    { src: shunnarahLogo, alt: "Alexander Shunnarah Trial Attorneys" },
    { src: dklawLogo, alt: "DK Law" }
  ];

  return (
    <div className="w-full">
      <div className="container mx-auto px-6 lg:px-12">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-6">
          Brands I've partnered with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
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
