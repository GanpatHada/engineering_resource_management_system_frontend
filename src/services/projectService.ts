const API_URL = import.meta.env.VITE_API_URL;

export interface ProjectPayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
}

export interface Project extends ProjectPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
   managerId: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
}

export async function addProject(payload: ProjectPayload): Promise<ApiResponse<any>> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create project");
  }

  return data;
}

export async function getAllProjects(): Promise<ApiResponse<Project[]>> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch projects");
  }

  return data;
}
