import { z } from "zod";

// Movie validation schema
export const movieSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  type: z.enum(["Movie", "TV Show"], {
    errorMap: () => ({ message: "Type must be either Movie or TV Show" }),
  }),
  director: z
    .string()
    .min(1, "Director is required")
    .max(255, "Director must be less than 255 characters"),
  budget: z
    .string()
    .min(1, "Budget is required")
    .max(100, "Budget must be less than 100 characters"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(255, "Location must be less than 255 characters"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .max(100, "Duration must be less than 100 characters"),
  year_time: z
    .string()
    .min(1, "Year/Time is required")
    .max(100, "Year/Time must be less than 100 characters"),
  description: z.string().optional(),
  rating: z.number().min(0).max(10).optional(),
  poster_url: z.string().url().optional().or(z.literal("")),
});

// Validation middleware
export const validateMovie = (req, res, next) => {
  try {
    const validatedData = movieSchema.parse(req.body);
    req.validatedData = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ID validation middleware
export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID provided",
    });
  }

  req.movieId = id;
  next();
};

// Pagination validation middleware
export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100",
    });
  }

  req.pagination = { page, limit };
  next();
};
