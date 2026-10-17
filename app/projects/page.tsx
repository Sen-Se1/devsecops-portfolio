import Projects from "@/components/Projects";
import { Suspense } from "react";

export default function ProjectsPage() {
  return (
    <main>
      <Suspense fallback={<p>Loading projects...</p>}>
        <Projects />
      </Suspense>
    </main>
  );
}
