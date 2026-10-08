type Project = {
  title: string;
  description: string;
};

const projects: Project[] = [
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

export default function Projects() {
  return (
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
  );
}