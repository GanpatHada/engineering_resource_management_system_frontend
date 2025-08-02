const API_URL = import.meta.env.VITE_API_URL;

export interface AssignmentPayload {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
}

export async function assignEngineer(payload: AssignmentPayload): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/assignments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Assignment failed");
}


export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
  status: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  _id: string;
  engineerId: string;
  projectId: Project;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAssignments(): Promise<Assignment[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/assignments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to fetch assignments");

  return data.data as Assignment[];
}