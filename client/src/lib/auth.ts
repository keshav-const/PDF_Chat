// import { User, LoginData, SignupData } from "@shared/schema";
// import { apiRequest } from "./queryClient";

// export async function login(data: LoginData): Promise<User> {
//   const response = await apiRequest("POST", "/api/auth/login", data);
//   return response.json();
// }

// export async function signup(data: SignupData): Promise<User> {
//   const response = await apiRequest("POST", "/api/auth/signup", data);
//   return response.json();
// }

// export async function logout(): Promise<void> {
//   await apiRequest("POST", "/api/auth/logout");
// }

// export async function getCurrentUser(): Promise<User> {
//   const response = await apiRequest("GET", "/api/auth/me");
//   return response.json();
// }

import { User, LoginData, SignupData } from "../../../shared/schema"; // Corrected import path
import { apiRequest } from "./queryClient";

export async function login(data: LoginData): Promise<User> {
  const response = await apiRequest("POST", "/api/auth/login", data);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }
  return response.json();
}

export async function signup(data: SignupData): Promise<User> {
  const response = await apiRequest("POST", "/api/auth/signup", data);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Signup failed");
  }
  return response.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}

// Renamed this function to match the import in App.tsx and history.tsx
export async function getLoggedInUser(): Promise<User | null> {
  try {
    const response = await apiRequest("GET", "/api/auth/me");
    if (response.status === 401) {
      return null;
    }
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching logged in user:", error);
    return null;
  }
}