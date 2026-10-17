const API_URL = process.env.API_URL || "http://localhost:4000";

export interface Project {
  slug: string;
  title: string;
  description: string;
}

export interface Skill {
  category: string;
  skills: string[];
}

async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${endpoint} (${response.status})`
    );
  }

  return response.json() as Promise<T>;
}

export function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/api/projects");
}

export function getSkills(): Promise<Skill[]> {
  return apiRequest<Skill[]>("/api/skills");
}

export function getProfile<T = Record<string, unknown>>(): Promise<T> {
  return apiRequest<T>("/api/profile");
}
