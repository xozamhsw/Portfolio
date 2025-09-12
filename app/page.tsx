import About from "@/components/view/AboutFormView";
import Projects from "@/components/view/ProjectsFormView";
import Skills from "@/components/view/SkillsFormView";
import Contact from "@/components/view/ContactFormView";
import Hero from "@/components/view/HeroFormView";

export default function Home() {
  return (
    <main>
      <section id="hero">
        <Hero/>
      </section>
      <section id="about">
        <About />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}
