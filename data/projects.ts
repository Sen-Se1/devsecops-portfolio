export type Project = {
  title: string;
  slug: string;
  description: string;
};

export const projects: Project[] = [
  {
    title: "Mini CV",
    slug: "mini-cv",
    description:
      "One-page CV developed using HTML5, CSS3 and JavaScript.",
  },
  {
    title: "DevOps Lab",
    slug: "devops-lab",
    description:
      "Practical environment using Linux, Git, Docker and CI/CD.",
  },
  {
    title: "Docker Portfolio",
    slug: "docker-portfolio",
    description:
      "Portfolio application containerized using Docker and Nginx.",
  },
  {
    title: "Jenkins CI/CD",
    slug: "jenkins-cicd",
    description:
      "Continuous integration environment using Jenkins and Docker.",
  },
];