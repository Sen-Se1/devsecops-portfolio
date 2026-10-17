import { getProjects } from "@/lib/api";
import Link from "next/link";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section id="projects">
      <h2>Projects</h2>

      <div className="projects">
        {projects.map((project) => (
          <div className="project" key={project.slug}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <Link
              href={`/projects/${project.slug}`}
              className="btn"
            >
              View Project
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
