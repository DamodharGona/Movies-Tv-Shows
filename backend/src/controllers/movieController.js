import Movie from "../models/Movie.js";

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    // Get page and limit from request, use defaults if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Get movies from database
    const movies = await Movie.getAll(page, limit);
    const totalCount = await Movie.getTotalCount();

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

// Get one movie by its ID
export const getMovieById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const movie = await Movie.getById(id);

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

// Create a new movie
export const createMovie = async (req, res) => {
  try {
    const movieData = req.body;

    const newMovie = await Movie.create(movieData);

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

// Update an existing movie
export const updateMovie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const movieData = req.body;

    // Check if movie exists before updating
    const existingMovie = await Movie.getById(id);
    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
        errors: [
          "Movie with the specified ID does not exist",
        ],
      });
    }

    const updatedMovie = await Movie.update(id, movieData);

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

// Delete a movie
export const deleteMovie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Check if movie exists before deleting
    const existingMovie = await Movie.getById(id);
    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
        errors: [
          "Movie with the specified ID does not exist",
        ],
      });
    }

    await Movie.delete(id);

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

// Search movies
export const searchMovies = async (req, res) => {
  try {
    const query = req.query.q;

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

    // Search movies in database
    const movies = await Movie.search(query, page, limit);

    res.json({
      success: true,
      data: movies,
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

// Filter movies
export const filterMovies = async (req, res) => {
  try {
    const filters = req.query;

    // Get page and limit from request, use defaults if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Filter movies in database
    const movies = await Movie.filterMovies(filters, page, limit);

    res.json({
      success: true,
      data: movies,
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
