import "./globals.css";

const projects = [
  {
    title: "Mini CV",
    description:
      "One-page CV developed using HTML5, CSS3 and JavaScript.",
  },
  {
    title: "DevOps Lab",
    description:
      "Practical environment using Linux, Git, Docker and CI/CD.",
  },
  {
    title: "Docker Portfolio",
    description:
      "Portfolio application containerized using Docker and Nginx.",
  },
  {
    title: "Jenkins CI/CD",
    description:
      "Continuous integration environment using Jenkins and Docker.",
  },
];

const skills = [
  "Git",
  "Docker",
  "Jenkins",
  "Kubernetes",
  "Ansible",
  "Terraform",
  "Argo CD",
];

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </nav>

      {/* Hero */}
      <header className="hero">
        <h1>Houssem Mbarki</h1>
        <p>DevOps Master Student</p>

        <a href="#contact" className="btn">
          Contact Me
        </a>
      </header>

      <main>
        {/* About */}
        <section id="about">
          <h2>About</h2>

          <p>
            I am a DevOps Master student interested in automation,
            cloud computing, Linux systems and modern IT technologies.
            I enjoy learning new technologies and building practical
            projects.
          </p>
        </section>

        {/* Skills */}
        <section id="skills">
          <h2>DevSecOps Skills</h2>

          <div className="skills">
            {skills.map((skill) => (
              <span className="skill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects">
          <h2>Projects</h2>

          <div className="projects">
            {projects.map((project) => (
              <div className="project" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
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

        {/* Contact */}
        <section id="contact">
          <h2>Contact</h2>

          <div className="contact">
            <div className="contact-item">
              <strong>Email</strong>
              houssem.mbarki@email.com
            </div>

            <div className="contact-item">
              <strong>Location</strong>
              Tunisia
            </div>

            <div className="contact-item">
              <strong>GitHub</strong>
              github.com/yourusername
            </div>

            <div className="contact-item">
              <strong>LinkedIn</strong>
              linkedin.com/in/yourusername
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        © 2026 Houssem Mbarki
      </footer>
    </>
  );
}