import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <About />

        <Suspense fallback={<p>Loading skills...</p>}>
          <Skills />
        </Suspense>

        <Suspense fallback={<p>Loading projects...</p>}>
          <Projects />
        </Suspense>

        <section id="experience">
          <h2>Experience</h2>

          <div className="experience">
            <h3>DevOps Student Projects</h3>
            <span>Academic Projects</span>
            <p>
              Worked on practical projects involving Linux, Docker, Git and
              CI/CD environments.
            </p>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
