import Movie from "../models/Movie.js";

// Get all movies for the authenticated user
export const getAllMovies = async (req, res) => {
  try {
    // Get page and limit from request, use defaults if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    // Get movies from database for the specific user
    const movies = await Movie.getAll(userId, page, limit);
    const totalCount = await Movie.getTotalCount(userId);

    // Calculate pagination info
    const pagination = {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };

    // Send response back to frontend
    res.json({
      success: true,
      data: movies,
      pagination,
      message: "Your movies retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve movies",
      errors: [error.message],
    });
  }
};

// Get one movie by its ID (only if owned by user)
export const getMovieById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;

    const movie = await Movie.getById(id, userId);

    // Check if movie exists
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
        errors: [
          "Movie with the specified ID does not exist or you don't have permission to view it",
        ],
      });
    }

    res.json({
      success: true,
      data: movie,
      message: "Movie retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve movie",
      errors: [error.message],
    });
  }
};

// Create a new movie for the authenticated user
export const createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    const userId = req.user.id;

    const newMovie = await Movie.create(movieData, userId);

    res.status(201).json({
      success: true,
      data: newMovie,
      message: "Movie added to your favorites successfully",
    });
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create movie",
      errors: [error.message],
    });
  }
};

// Update an existing movie (only if owned by user)
export const updateMovie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const movieData = req.body;
    const userId = req.user.id;

    // Check if movie exists and belongs to user before updating
    const existingMovie = await Movie.getById(id, userId);
    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
        errors: [
          "Movie with the specified ID does not exist or you don't have permission to update it",
        ],
      });
    }

    const updatedMovie = await Movie.update(id, movieData, userId);

    res.json({
      success: true,
      data: updatedMovie,
      message: "Movie updated successfully",
    });
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update movie",
      errors: [error.message],
    });
  }
};

// Delete a movie (only if owned by user)
export const deleteMovie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if movie exists and belongs to user before deleting
    const existingMovie = await Movie.getById(id, userId);
    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
        errors: [
          "Movie with the specified ID does not exist or you don't have permission to delete it",
        ],
      });
    }

    await Movie.delete(id, userId);

    res.json({
      success: true,
      message: "Movie removed from your favorites successfully",
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete movie",
      errors: [error.message],
    });
  }
};

// Search movies for the authenticated user
export const searchMovies = async (req, res) => {
  try {
    const query = req.query.q;
    const userId = req.user.id;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
        errors: ["Please provide a search term"],
      });
    }

    // Get page and limit from request, use defaults if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Search movies in database for the specific user
    const movies = await Movie.search(query, userId, page, limit);
    const totalCount = await Movie.getTotalCount(userId);

    // Calculate pagination info
    const pagination = {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };

    res.json({
      success: true,
      data: movies,
      pagination,
      message: `Found ${movies.length} movies matching "${query}"`,
    });
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search movies",
      errors: [error.message],
    });
  }
};

// Filter movies for the authenticated user
export const filterMovies = async (req, res) => {
  try {
    const filters = req.query;
    const userId = req.user.id;

    // Get page and limit from request, use defaults if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Filter movies in database for the specific user
    const movies = await Movie.filterMovies(filters, userId, page, limit);
    const totalCount = await Movie.getTotalCount(userId);

    // Calculate pagination info
    const pagination = {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };

    res.json({
      success: true,
      data: movies,
      pagination,
      message: `Found ${movies.length} movies matching your filters`,
    });
  } catch (error) {
    console.error("Error filtering movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter movies",
      errors: [error.message],
    });
  }
};
