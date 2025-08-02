// API service for making HTTP requests to our backend
import type { NewMovie, MoviesResponse, MovieResponse } from "@/types/movie";

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Debug: Log the API base URL to verify it's being set correctly
console.log("API_BASE_URL:", API_BASE_URL);

// Helper function to get headers with authentication
const getHeaders = () => {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Generic HTTP methods
const http = {
  async get(url: string) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post(url: string, data?: any) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async put(url: string, data?: any) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "PUT",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async delete(url: string) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// API service object with all our methods
export const apiService = {
  // Generic HTTP methods for authentication
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,

  // Get movies with pagination
  async getMovies(
    page: number = 1,
    limit: number = 10
  ): Promise<MoviesResponse> {
    try {
      const data = await http.get(`/api/movies?page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  // Get a single movie by ID
  async getMovie(id: number): Promise<MovieResponse> {
    try {
      const data = await http.get(`/api/movies/${id}`);
      return data;
    } catch (error) {
      console.error("Error fetching movie:", error);
      throw error;
    }
  },

  // Create a new movie
  async createMovie(movieData: NewMovie): Promise<MovieResponse> {
    try {
      const data = await http.post("/api/movies", movieData);
      return data;
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  },

  // Update an existing movie
  async updateMovie(id: number, movieData: NewMovie): Promise<MovieResponse> {
    try {
      const data = await http.put(`/api/movies/${id}`, movieData);
      return data;
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  // Delete a movie
  async deleteMovie(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const data = await http.delete(`/api/movies/${id}`);
      return data;
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  },

  // Search movies
  async searchMovies(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<MoviesResponse> {
    try {
      const data = await http.get(
        `/api/movies/search?q=${encodeURIComponent(
          query
        )}&page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  },

  // Filter movies
  async filterMovies(
    filters: {
      type?: string;
      director?: string;
      yearFrom?: string;
      yearTo?: string;
      rating?: string;
      location?: string;
    },
    page: number = 1,
    limit: number = 10
  ): Promise<MoviesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const data = await http.get(`/api/movies/filter?${params}`);
      return data;
    } catch (error) {
      console.error("Error filtering movies:", error);
      throw error;
    }
  },
};
