import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../../../data/projects";

type ProjectPageProps = {
  params: {
    "project-name": string;
  };
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectName = params["project-name"];

  const project = projects.find(
    (project) => project.slug === projectName
  );

  if (!project) {
    notFound();
  }

  return (
    <main>
      <section id="project-details">
        <h2>{project.title}</h2>

        <p>{project.description}</p>

        <Link href="/projects" className="btn">
          Back to Projects
        </Link>
      </section>
    </main>
  );
}