import { pool } from "../config/database.js";

// Movie class to handle database operations
class Movie {
  // Get all movies for a specific user with pagination
  static async getAll(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await pool.execute(
        `SELECT * FROM movies WHERE user_id = ? ORDER BY created_at DESC LIMIT ${parseInt(
          limit
        )} OFFSET ${parseInt(offset)}`,
        [parseInt(userId)]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  // Get one movie by its ID (only if owned by user)
  static async getById(id, userId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM movies WHERE id = ? AND user_id = ?",
        [parseInt(id), parseInt(userId)]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching movie: ${error.message}`);
    }
  }

  // Add a new movie to database (with user_id)
  static async create(movieData, userId) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO movies (user_id, title, type, director, budget, location, duration, year_time, description, rating, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parseInt(userId),
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
      return { id: result.insertId, user_id: userId, ...movieData };
    } catch (error) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  // Update an existing movie (only if owned by user)
  static async update(id, movieData, userId) {
    try {
      const [result] = await pool.execute(
        `UPDATE movies SET 
         title = ?, type = ?, director = ?, budget = ?, location = ?, 
         duration = ?, year_time = ?, description = ?, rating = ?, poster_url = ?
         WHERE id = ? AND user_id = ?`,
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
          parseInt(userId),
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error("Movie not found or access denied");
      }

      return { id, user_id: userId, ...movieData };
    } catch (error) {
      throw new Error(`Error updating movie: ${error.message}`);
    }
  }

  // Delete a movie (only if owned by user)
  static async delete(id, userId) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM movies WHERE id = ? AND user_id = ?",
        [parseInt(id), parseInt(userId)]
      );

      if (result.affectedRows === 0) {
        throw new Error("Movie not found or access denied");
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting movie: ${error.message}`);
    }
  }

  // Search movies for a specific user
  static async search(query, userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const searchTerm = `%${query}%`;

      const [rows] = await pool.execute(
        `SELECT * FROM movies 
         WHERE user_id = ? AND (
           title LIKE ? OR 
           director LIKE ? OR 
           location LIKE ? OR
           budget LIKE ? OR
           duration LIKE ? OR
           year_time LIKE ?
         ) 
         ORDER BY created_at DESC 
         LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
        [
          parseInt(userId),
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
        ]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error searching movies: ${error.message}`);
    }
  }

  // Filter movies for a specific user
  static async filterMovies(filters, userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      let whereConditions = ["user_id = ?"];
      let queryParams = [parseInt(userId)];

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

      const whereClause = whereConditions.join(" AND ");

      const [rows] = await pool.execute(
        `SELECT * FROM movies 
         WHERE ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
        queryParams
      );

      return rows;
    } catch (error) {
      throw new Error(`Error filtering movies: ${error.message}`);
    }
  }

  // Get total count of movies for a specific user
  static async getTotalCount(userId) {
    try {
      const [rows] = await pool.execute(
        "SELECT COUNT(*) as count FROM movies WHERE user_id = ?",
        [parseInt(userId)]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error getting total count: ${error.message}`);
    }
  }
}

export default Movie;
