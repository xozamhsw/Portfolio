import Hero from "@/components/view/HeroFormView";
import About from "@/components/view/AboutFormView";
import Skills from "@/components/view/SkillsFormView";
import Projects from "@/components/view/ProjectsFormView";
import Contact from "@/components/view/ContactFormView";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
