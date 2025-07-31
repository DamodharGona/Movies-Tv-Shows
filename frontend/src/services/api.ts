// API service for making HTTP requests to our backend
import type { NewMovie, MoviesResponse, MovieResponse } from "@/types/movie";

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Debug: Log the API base URL to verify it's being set correctly
console.log("API_BASE_URL:", API_BASE_URL);

// Helper function to get headers
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

// API service object with all our methods
export const apiService = {
  // Get movies with pagination
  async getMovies(
    page: number = 1,
    limit: number = 10
  ): Promise<MoviesResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/movies?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  // Get a single movie by ID
  async getMovie(id: number): Promise<MovieResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie:", error);
      throw error;
    }
  },

  // Create a new movie
  async createMovie(movieData: NewMovie): Promise<MovieResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  },

  // Update an existing movie
  async updateMovie(id: number, movieData: NewMovie): Promise<MovieResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
      const response = await fetch(
        `${API_BASE_URL}/api/movies/search?q=${encodeURIComponent(
          query
        )}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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

      const response = await fetch(
        `${API_BASE_URL}/api/movies/filter?${params}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error filtering movies:", error);
      throw error;
    }
  },
};
