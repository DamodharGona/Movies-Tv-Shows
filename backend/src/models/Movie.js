import { pool } from "../config/database.js";

// Movie class to handle database operations
class Movie {
  // Get all movies with pagination
  static async getAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await pool.execute(
        "SELECT * FROM movies ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [parseInt(limit), parseInt(offset)]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  // Get one movie by its ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM movies WHERE id = ?",
        [parseInt(id)]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching movie: ${error.message}`);
    }
  }

  // Add a new movie to database
  static async create(movieData) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO movies (title, type, director, budget, location, duration, year_time, description, rating, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          movieData.title,
          movieData.type,
          movieData.director,
          movieData.budget,
          movieData.location,
          movieData.duration,
          movieData.year_time,
          movieData.description || null,
          movieData.rating || null,
          movieData.poster_url || null,
        ]
      );
      return { id: result.insertId, ...movieData };
    } catch (error) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  // Update an existing movie
  static async update(id, movieData) {
    try {
      const [result] = await pool.execute(
        `UPDATE movies SET 
         title = ?, type = ?, director = ?, budget = ?, location = ?, 
         duration = ?, year_time = ?, description = ?, rating = ?, poster_url = ?
         WHERE id = ?`,
        [
          movieData.title,
          movieData.type,
          movieData.director,
          movieData.budget,
          movieData.location,
          movieData.duration,
          movieData.year_time,
          movieData.description || null,
          movieData.rating || null,
          movieData.poster_url || null,
          parseInt(id),
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error("Movie not found");
      }

      return { id, ...movieData };
    } catch (error) {
      throw new Error(`Error updating movie: ${error.message}`);
    }
  }

  // Delete a movie
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM movies WHERE id = ?",
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        throw new Error("Movie not found");
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting movie: ${error.message}`);
    }
  }

  // Search movies
  static async search(query, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const searchTerm = `%${query}%`;

      const [rows] = await pool.execute(
        `SELECT * FROM movies 
         WHERE (
           title LIKE ? OR 
           director LIKE ? OR 
           location LIKE ? OR
           budget LIKE ? OR
           duration LIKE ? OR
           year_time LIKE ?
         ) 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          parseInt(limit),
          parseInt(offset),
        ]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error searching movies: ${error.message}`);
    }
  }

  // Filter movies
  static async filterMovies(filters, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      let whereConditions = [];
      let queryParams = [];

      // Add filter conditions
      if (filters.type && filters.type !== "All") {
        whereConditions.push("type = ?");
        queryParams.push(filters.type);
      }

      if (filters.director) {
        whereConditions.push("director LIKE ?");
        queryParams.push(`%${filters.director}%`);
      }

      if (filters.yearFrom) {
        whereConditions.push("year_time >= ?");
        queryParams.push(filters.yearFrom);
      }

      if (filters.yearTo) {
        whereConditions.push("year_time <= ?");
        queryParams.push(filters.yearTo);
      }

      if (filters.rating) {
        whereConditions.push("rating >= ?");
        queryParams.push(parseFloat(filters.rating));
      }

      if (filters.location) {
        whereConditions.push("location LIKE ?");
        queryParams.push(`%${filters.location}%`);
      }

      const whereClause = whereConditions.length > 0 ? whereConditions.join(" AND ") : "1=1";

      const [rows] = await pool.execute(
        `SELECT * FROM movies 
         WHERE ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), parseInt(offset)]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error filtering movies: ${error.message}`);
    }
  }

  // Get total count of movies
  static async getTotalCount() {
    try {
      const [rows] = await pool.execute(
        "SELECT COUNT(*) as count FROM movies"
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error getting total count: ${error.message}`);
    }
  }
}

export default Movie;
