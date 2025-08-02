import { apiService } from "./api";

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

class AuthService {
  private tokenKey = "auth_token";
  private userKey = "auth_user";

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Set token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Get user from localStorage
  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set user in localStorage
  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Remove user from localStorage
  removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post("/api/auth/login", {
        email,
        password,
      });

      const { user, token } = response;
      
      // Store token and user data
      this.setToken(token);
      this.setUser(user);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Register user
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post("/api/auth/register", {
        username,
        email,
        password,
      });

      const { user, token } = response;
      
      // Store token and user data
      this.setToken(token);
      this.setUser(user);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  // Verify token with server
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      const response = await apiService.get("/api/auth/verify");
      return response.valid;
    } catch (error) {
      // If verification fails, clear auth data
      this.logout();
      return false;
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiService.get("/api/auth/profile");
      const user = response.user;
      this.setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(updates: { username?: string; email?: string }): Promise<User> {
    try {
      const response = await apiService.put("/api/auth/profile", updates);
      const user = response.user;
      this.setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete user account
  async deleteAccount(): Promise<void> {
    try {
      await apiService.delete("/api/auth/account");
      this.logout();
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService(); 