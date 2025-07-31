import express from "express";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  filterMovies,
} from "../controllers/movieController.js";

const router = express.Router();

// Route to get all movies for authenticated user
router.get("/", getAllMovies);

// Route to search movies for authenticated user (must be before :id route)
router.get("/search", searchMovies);

// Route to filter movies for authenticated user (must be before :id route)
router.get("/filter", filterMovies);

// Route to get one movie by ID (only if it belongs to the user)
router.get("/:id", getMovieById);

// Route to create a new movie for authenticated user
router.post("/", createMovie);

// Route to update a movie (only if it belongs to the user)
router.put("/:id", updateMovie);

// Route to delete a movie (only if it belongs to the user)
router.delete("/:id", deleteMovie);

export default router;
