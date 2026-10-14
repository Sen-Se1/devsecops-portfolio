import { skills } from "../data/skills";

export default function Skills() {
  return (
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
  );
}