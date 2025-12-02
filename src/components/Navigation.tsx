import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoMark from "@/assets/dan-jimmerson-logo.svg";
import { useContact } from "@/context/ContactContext";
import MusicPlayer from "@/components/MusicPlayer";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navigation = ({ alwaysShowBackground = true }: { alwaysShowBackground?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openContact } = useContact();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false); // Close menu on click
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const element = document.getElementById(hash.replace("#", ""));
      element?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", hash);
    }
  };

  const NavItem = ({ to, label, isHash = false, mobile = false }: { to: string; label: string; isHash?: boolean; mobile?: boolean }) => {
    const isHome = location.pathname === "/" && location.hash === "";
    const isActive = isHash
      ? location.hash === to
      : (to === "/" ? isHome : location.pathname.startsWith(to));

    if (mobile) {
      return (
        <motion.a
          href={to}
          onClick={(e) => {
            if (isHash) {
              e.preventDefault();
              handleNavClick(to);
            } else {
              setMobileMenuOpen(false);
            }
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={cn(
            "text-4xl font-sans font-bold transition-colors hover:text-accent block py-4",
            isActive ? "text-accent" : "text-white"
          )}
        >
          {label}
        </motion.a>
      );
    }

    return (
      <a
        href={to}
        onClick={(e) => {
          if (isHash) {
            e.preventDefault();
            handleNavClick(to);
          }
        }}
        className={cn(
          "h-20 flex items-center relative px-1 text-sm font-medium transition-colors hover:text-accent",
          isActive ? "text-white" : "text-white/80"
        )}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-[3px] bg-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        )}
      </a>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${!mobileMenuOpen && (scrolled || alwaysShowBackground)
          ? "bg-black/95 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="hover:opacity-80 transition-opacity z-50 relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={logoMark}
                alt="Dan Jimmerson"
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavItem to="/" label="Home" />
              <NavItem to="#about" label="About" isHash />
              <NavItem to="#work" label="Work" isHash />
              <NavItem to="/feed" label="Feed" />
              <NavItem to="#contact" label="Contact" isHash />
            </div>

            {/* Desktop CTA & Music */}
            <div className="hidden md:flex items-center gap-4">
              <MusicPlayer />
              <Button variant="accent" size="lg" className="text-white" onClick={openContact}>
                Let's Talk
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-4 z-50 relative">
              {!mobileMenuOpen && <MusicPlayer />}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full Screen Menu Portal */}
      {createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-[45] flex flex-col items-center justify-center overflow-hidden"
            >
              {/* Animated Background Blobs */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                  className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px]"
                  animate={{
                    x: [0, 100, -100, 0],
                    y: [0, -100, 100, 0],
                    scale: [1, 1.2, 0.8, 1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px]"
                  animate={{
                    x: [0, -100, 100, 0],
                    y: [0, 100, -100, 0],
                    scale: [1, 1.2, 0.8, 1],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <NavItem to="/" label="Home" mobile />
                <NavItem to="#about" label="About" isHash mobile />
                <NavItem to="#work" label="Work" isHash mobile />
                <NavItem to="/feed" label="Feed" mobile />
                <NavItem to="#contact" label="Contact" isHash mobile />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8"
                >
                  <Button
                    variant="accent"
                    size="lg"
                    className="text-white text-lg px-8 py-6 rounded-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openContact();
                    }}
                  >
                    Let's Talk
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Navigation;
