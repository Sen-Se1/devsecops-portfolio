import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProjects } from "@/lib/api";

type ProjectPageProps = {
  params: Promise<{
    "project-name": string;
  }>;
};

async function ProjectDetails({ params }: ProjectPageProps) {
  const { "project-name": projectName } = await params;
  const projects = await getProjects();

  const project = projects.find(
    (item) => item.slug === projectName
  );

  if (!project) {
    notFound();
  }

  return (
    <section id="project-details">
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <Link href="/projects" className="btn">
        Back to Projects
      </Link>
    </section>
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <main>
      <Suspense fallback={<p>Loading project details...</p>}>
        <ProjectDetails params={params} />
      </Suspense>
    </main>
  );
}
