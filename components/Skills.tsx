import { getSkills } from "@/lib/api";

export default async function Skills() {
  const categories = await getSkills();

  return (
    <section id="skills">
      <h2>DevSecOps Skills</h2>

      <div className="skills">
        {categories.flatMap((category) =>
          category.skills.map((skill) => (
            <span className="skill" key={`${category.category}-${skill}`}>
              {skill}
            </span>
          ))
        )}
      </div>
    </section>
  );
}
