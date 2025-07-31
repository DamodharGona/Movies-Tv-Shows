import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Movie } from "@/types/movie";

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export const MovieTable: React.FC<MovieTableProps> = ({
  movies,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
  isLoading,
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  // Simple scroll detection for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (observerRef.current) {
        const rect = observerRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight && hasMore && !isLoading) {
          onLoadMore();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, onLoadMore]);

  const handleDelete = (movie: Movie) => {
    setMovieToDelete(movie);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (movieToDelete) {
      onDelete(movieToDelete.id!);
    }
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setMovieToDelete(null);
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-[800px] sm:min-w-full">
        <table className="w-full border-collapse rounded-lg overflow-hidden text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">
                Title
              </th>
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">
                Type
              </th>
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">
                Director
              </th>
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">
                Budget
              </th>
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">
                Location
              </th>
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">
                Duration
              </th>
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">
                Year/Time
              </th>
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">
                Rating
              </th>
              <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center space-x-2">
                    {movie.poster_url && (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-6 h-8 sm:w-8 sm:h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{movie.title}</div>
                      {movie.description && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {movie.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      movie.type === "Movie"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {movie.type}
                  </span>
                </td>
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  <div className="truncate">{movie.director}</div>
                </td>
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  <div className="truncate">{movie.budget}</div>
                </td>
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  <div className="truncate">{movie.location}</div>
                </td>
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  <div className="truncate">{movie.duration}</div>
                </td>
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  <div className="truncate">{movie.year_time}</div>
                </td>
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  {movie.rating ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span>{movie.rating}/10</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-3">
                  <div className="flex flex-col sm:flex-row justify-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(movie)}
                      className="hover:cursor-pointer text-xs px-2 py-1"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(movie)}
                      className="hover:cursor-pointer text-red-600 border-red-300 hover:bg-red-50 text-xs px-2 py-1"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple loading indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm">Loading more movies...</span>
        </div>
      )}

      {/* Observer div for infinite scroll */}
      <div ref={observerRef} className="h-4"></div>

      {movies.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
          No movies found. Add your first movie!
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${movieToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};
