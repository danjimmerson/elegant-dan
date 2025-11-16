import { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import logoMark from "@/assets/dan-jimmerson-logo.svg";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink
            to="/"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src={logoMark} 
              alt="Dan Jimmerson" 
              className="h-8 w-auto"
            />
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className="text-foreground hover:text-accent transition-colors font-medium"
              activeClassName="text-accent"
            >
              Home
            </NavLink>
            <NavLink
              to="/work"
              className="text-foreground hover:text-accent transition-colors font-medium"
              activeClassName="text-accent"
            >
              Work
            </NavLink>
            <NavLink
              to="/about"
              className="text-foreground hover:text-accent transition-colors font-medium"
              activeClassName="text-accent"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="text-foreground hover:text-accent transition-colors font-medium"
              activeClassName="text-accent"
            >
              Contact
            </NavLink>
          </div>

          {/* CTA Button */}
          <Button variant="accent" size="lg" className="hidden md:inline-flex">
            Let's Talk
          </Button>

          {/* Mobile menu button - for future implementation */}
          <button className="md:hidden text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
