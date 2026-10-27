const profile = {
  name: "Houssem",
  title: "Junior DevSecOps Engineer",
  summary:
    "Engineering student building practical skills in Linux, automation, containers and CI/CD.",
  location: "Tunisia",
  github: "https://github.com/Sen-Se1",
};

const skills = [
  {
    category: "DevSecOps Skills",
    skills: [
      "Git",
      "Docker",
      "Jenkins",
      "Kubernetes",
      "Ansible",
      "Terraform",
      "Argo CD",
    ],
  },
];

const projects = [
  {
    title: "Mini CV",
    slug: "mini-cv",
    description: "One-page CV developed using HTML5, CSS3 and JavaScript.",
  },
  {
    title: "DevOps Lab",
    slug: "devops-lab",
    description: "Practical environment using Linux, Git, Docker and CI/CD.",
  },
  {
    title: "Docker Portfolio",
    slug: "docker-portfolio",
    description: "Portfolio application containerized using Docker.",
  },
  {
    title: "Jenkins CI/CD",
    slug: "jenkins-cicd",
    description: "Continuous integration pipeline for the portfolio project.",
  },
];

module.exports = {
  profile,
  skills,
  projects,
};