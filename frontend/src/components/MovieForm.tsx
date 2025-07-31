import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { Movie, NewMovie } from "@/types/movie";

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (movieData: NewMovie) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const MovieForm: React.FC<MovieFormProps> = ({
  movie,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "Movie" as "Movie" | "TV Show",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year_time: "",
    description: "",
    rating: "",
    poster_url: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        type: (movie.type as "Movie" | "TV Show") || "Movie",
        director: movie.director || "",
        budget: movie.budget || "",
        location: movie.location || "",
        duration: movie.duration || "",
        year_time: movie.year_time || "",
        description: movie.description || "",
        rating: movie.rating ? movie.rating.toString() : "",
        poster_url: movie.poster_url || "",
      });
    }
  }, [movie]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.director.trim()) {
      newErrors.director = "Director is required";
    }

    if (!formData.budget.trim()) {
      newErrors.budget = "Budget is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!formData.year_time.trim()) {
      newErrors.year_time = "Year/Time is required";
    }

    if (
      formData.rating &&
      (isNaN(Number(formData.rating)) ||
        Number(formData.rating) < 0 ||
        Number(formData.rating) > 10)
    ) {
      newErrors.rating = "Rating must be between 0 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        title: formData.title.trim(),
        type: formData.type,
        director: formData.director.trim(),
        budget: formData.budget.trim(),
        location: formData.location.trim(),
        duration: formData.duration.trim(),
        year_time: formData.year_time.trim(),
        description: formData.description.trim(),
        rating: formData.rating ? Number(formData.rating) : undefined,
        poster_url: formData.poster_url.trim() || undefined,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter movie title"
            className={` ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <Select
            value={formData.type}
            onChange={(e) =>
              handleInputChange("type", e.target.value as "Movie" | "TV Show")
            }
            className={errors.type ? "border-red-500" : ""}
          >
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Director *</label>
          <Input
            value={formData.director}
            onChange={(e) => handleInputChange("director", e.target.value)}
            placeholder="Enter director name"
            className={errors.director ? "border-red-500" : ""}
          />
          {errors.director && (
            <p className="text-red-500 text-xs mt-1">{errors.director}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Budget *</label>
          <Input
            value={formData.budget}
            onChange={(e) => handleInputChange("budget", e.target.value)}
            placeholder="e.g., $160M, $3M/ep"
            className={errors.budget ? "border-red-500" : ""}
          />
          {errors.budget && (
            <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g., LA, Paris, Albuquerque"
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration *</label>
          <Input
            value={formData.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            placeholder="e.g., 148 min, 49 min/ep"
            className={errors.duration ? "border-red-500" : ""}
          />
          {errors.duration && (
            <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year/Time *</label>
          <Input
            value={formData.year_time}
            onChange={(e) => handleInputChange("year_time", e.target.value)}
            placeholder="e.g., 2010, 2008-2013"
            className={errors.year_time ? "border-red-500" : ""}
          />
          {errors.year_time && (
            <p className="text-red-500 text-xs mt-1">{errors.year_time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <Input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.rating}
            onChange={(e) => handleInputChange("rating", e.target.value)}
            placeholder="0-10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Poster URL</label>
          <Input
            type="url"
            value={formData.poster_url}
            onChange={(e) => handleInputChange("poster_url", e.target.value)}
            placeholder="https://example.com/poster.jpg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter movie description..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="hover:cursor-pointer w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          variant="outline"
          className="hover:cursor-pointer w-full sm:w-auto"
        >
          {isLoading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
        </Button>
      </div>
    </form>
  );
};
