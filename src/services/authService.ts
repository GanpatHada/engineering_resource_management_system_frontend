const API_URL = import.meta.env.VITE_API_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export type Role = "engineer" | "manager";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  skills?: string[];
  seniority?: "junior" | "mid" | "senior";
  maxCapacity?: number;
  department?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export async function login(credentials: LoginCredentials): Promise<{
  token: string;
  user: User;
}> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const resJson: LoginResponse = await response.json();

    if (!resJson.success) {
      throw new Error(resJson.message);
    }

    return resJson.data;
  } catch (error: any) {
    console.error("Login error:", error.message);
    throw error;
  }
}

export async function fetchProfile(): Promise<User> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const resJson: ProfileResponse = await response.json();

    if (!resJson.success) {
      throw new Error(resJson.message);
    }

    return resJson.data;
  } catch (error: any) {
    console.error("Profile fetch error:", error.message);
    throw error;
  }
}
