import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <About />
        <Skills />
        <Projects />

        <section id="experience">
          <h2>Experience</h2>

          <div className="experience">
            <h3>DevOps Student Projects</h3>

            <span>Academic Projects</span>

            <p>
              Worked on practical projects involving Linux,
              Docker, Git and CI/CD environments.
            </p>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </>
  );
}