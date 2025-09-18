import { User, LoginData, SignupData } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function login(data: LoginData): Promise<User> {
  const response = await apiRequest("POST", "/api/auth/login", data);
  return response.json();
}

export async function signup(data: SignupData): Promise<User> {
  const response = await apiRequest("POST", "/api/auth/signup", data);
  return response.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiRequest("GET", "/api/auth/me");
  return response.json();
}
