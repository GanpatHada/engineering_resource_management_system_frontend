import type { User } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export interface Engineer {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  seniority?: "junior" | "mid" | "senior";
  maxCapacity?: number;
  department?: string;
}

interface UpdateSkillsResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: User;
}

export interface EngineersApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: Engineer[];
}




export async function getAllEngineers(): Promise<Engineer[]> {
  const res = await fetch(`${API_URL}/engineers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch engineers");
  }

  const json: EngineersApiResponse = await res.json();
  return json.data;
}

export async function getEngineerCapacity(engineerId: string): Promise<number> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/engineers/${engineerId}/capacity`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch capacity");
  }

  return json.data.availableCapacity;
}


export async function updateEngineerSkills(skills: string[]): Promise<User> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/engineers/update-skills`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ skills }),
  });

  const json: UpdateSkillsResponse = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update skills");
  }

  return json.data; // this is typed as User now, so setUser(json.data) works
}
