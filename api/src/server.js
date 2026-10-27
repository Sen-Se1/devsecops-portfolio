const express = require("express");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "10kb" }));

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

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
  });
});

app.get("/api/profile", (_req, res) => res.json(profile));
app.get("/api/projects", (_req, res) => res.json(projects));
app.get("/api/skills", (_req, res) => res.json(skills));

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({
      success: false,
      error: "Name, email and message are required.",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({
      success: false,
      error: "All fields are required.",
    });
  }

  if (
    cleanName.length > 100 ||
    cleanEmail.length > 254 ||
    cleanMessage.length > 5000
  ) {
    return res.status(400).json({
      success: false,
      error: "One or more fields exceed the allowed length.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email address.",
    });
  }

  // TODO: enregistrer le message en base de données
  // ou envoyer un e-mail au propriétaire du Portfolio.

  return res.status(201).json({
    success: true,
    message: "Contact message received successfully.",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio API listening on port ${PORT}`);
});
