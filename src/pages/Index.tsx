import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navigation />
      <Hero />
      <About />
    </div>
  );
};

export default Index;
