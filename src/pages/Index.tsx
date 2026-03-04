import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { ResumeSection } from "@/components/ResumeSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Timeline />
      <Skills />
      <Projects />
      <ResumeSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
