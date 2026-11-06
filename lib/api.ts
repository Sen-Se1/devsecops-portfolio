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

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
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

export async function submitContact(
  payload: ContactPayload
): Promise<ContactResponse> {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json()) as ContactResponse;

  if (!response.ok) {
    throw new Error(result.error || "Failed to submit contact form.");
  }

  return result;
}
