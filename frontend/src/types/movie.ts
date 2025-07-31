export interface Movie {
  id?: number;
  title: string;
  type: "Movie" | "TV Show";
  director: string;
  budget: string;
  location: string;
  duration: string;
  year_time: string;
  description?: string;
  rating?: number;
  poster_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Simple interface for creating new movies (without id)
export interface NewMovie {
  title: string;
  type: "Movie" | "TV Show";
  director: string;
  budget: string;
  location: string;
  duration: string;
  year_time: string;
  description?: string;
  rating?: number;
  poster_url?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MoviesResponse {
  success: boolean;
  data: Movie[];
  pagination: Pagination;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface MovieResponse {
  success: boolean;
  data: Movie;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
