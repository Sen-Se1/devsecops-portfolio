const express = require("express");
const cors = require("cors");
const { z } = require("zod");

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "10kb" }));

const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(254, "Email must not exceed 254 characters")
      .email("Invalid email address"),

    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(5000, "Message must not exceed 5000 characters"),
  })
  .strict();

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
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { name, email, message } = result.data;

  // TODO: Save the message to a database
  // or send an email to the Portfolio owner.

  console.log("Valid contact submission received:", {
    name,
    email,
    messageLength: message.length,
  });

  return res.status(201).json({
    success: true,
    message: "Contact message received successfully.",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio API listening on port ${PORT}`);
});
