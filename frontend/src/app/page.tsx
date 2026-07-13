import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/landing/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-primary selection:bg-accent-purple/30">
      <Navbar />
      <HeroSection />
      
      {/* 
        This is Stage 2! The other 10 landing page sections (Demo, Bento Grid, Pricing, etc) 
        will go here in the next iterations. 
      */}
      
    </main>
  );
}
