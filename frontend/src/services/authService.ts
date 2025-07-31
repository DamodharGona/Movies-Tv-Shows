// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";

// Debug: Log the auth API base URL to verify it's being set correctly
console.log("Auth API_BASE_URL:", API_BASE_URL);

// Interface for user data
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

// Interface for login response
export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

// Interface for signup response
export interface SignupResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

// Authentication service class
class AuthService {
  // Login user
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error) {
      throw new Error(
        `Login error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Signup user
  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<SignupResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      return data;
    } catch (error) {
      throw new Error(
        `Signup error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Logout user (clear token from localStorage)
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}

// Create and export a single instance
export const authService = new AuthService();
