import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MovieForm } from "@/components/MovieForm";
import { MovieTable } from "@/components/MovieTable";
import { MovieFilter } from "@/components/MovieFilter";
import { Toast } from "@/components/Toast";
import { AuthPage } from "@/components/AuthPage";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import type { Movie, NewMovie } from "@/types/movie";
import {
  FaFilm,
  FaSearch,
  FaFilter,
  FaPlus,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

// This interface defines what data we need for filtering movies
interface FilterOptions {
  type: string;
  director: string;
  yearFrom: string;
  yearTo: string;
  rating: string;
  location: string;
}

function App() {
  // Authentication
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // State variables to store our data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Toast hook for showing notifications
  const { toast, isVisible, hideToast, showSuccess, showError, showInfo } =
    useToast();

  // Load movies when the app starts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadMovies();
    }
  }, [isAuthenticated, isLoading]);

  // Function to load movies from the API
  const loadMovies = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      const response = await apiService.getMovies(page, 10);

      if (append) {
        // If appending, add new movies to existing list
        setMovies((prev) => [...prev, ...response.data]);
      } else {
        // If not appending, replace the list
        setMovies(response.data);
      }

      setCurrentPage(response.pagination.page);
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load movies:", error);
      showError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to load all movies when user clicks the button
  const handleLoadAllMovies = () => {
    loadMovies(1, false);
  };

  // Function to load more movies when user scrolls (infinite scroll)
  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      loadMovies(currentPage + 1, true);
    }
  };

  // Function to search movies
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showInfo("Please enter a search term");
      return;
    }

    try {
      setIsSearching(true);
      const response = await apiService.searchMovies(searchQuery, 1, 10);
      setMovies(response.data);
      setCurrentPage(response.pagination.page);
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to search movies:", error);
      showError("Failed to search movies. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Function to add a new movie
  const handleAddMovie = async (movieData: NewMovie) => {
    try {
      await apiService.createMovie(movieData);
      setShowForm(false);
      await loadMovies(); // Refresh the table
      showSuccess("Movie added successfully!");
    } catch (error) {
      console.error("Failed to add movie:", error);
      showError("Failed to add movie. Please try again.");
    }
  };

  // Function to edit an existing movie
  const handleEditMovie = async (movieData: NewMovie) => {
    if (!editingMovie?.id) return;

    try {
      await apiService.updateMovie(editingMovie.id, movieData);
      setShowForm(false);
      setEditingMovie(undefined);
      await loadMovies(); // Refresh the table
      showSuccess("Movie updated successfully!");
    } catch (error) {
      console.error("Failed to update movie:", error);
      showError("Failed to update movie. Please try again.");
    }
  };

  // Function to delete a movie
  const handleDeleteMovie = async (id: number) => {
    try {
      await apiService.deleteMovie(id);
      await loadMovies(); // Refresh the table
      showSuccess("Movie deleted successfully!");
    } catch (error) {
      console.error("Failed to delete movie:", error);
      showError("Failed to delete movie. Please try again.");
    }
  };

  // Function to start editing a movie
  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  // Function to cancel the form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMovie(undefined);
  };

  // Function to submit the form (add or edit)
  const handleSubmitForm = (movieData: NewMovie) => {
    if (editingMovie) {
      handleEditMovie(movieData);
    } else {
      handleAddMovie(movieData);
    }
  };

  // Function to apply filters
  const handleApplyFilters = async (filters: FilterOptions) => {
    try {
      setLoading(true);
      const response = await apiService.filterMovies(filters, 1, 10);
      setMovies(response.data);
      setCurrentPage(response.pagination.page);
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to filter movies:", error);
      showError("Failed to filter movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully!");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2">
              <FaFilm className="text-blue-600" />
              Movie Collection Manager
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaUser className="text-blue-600" />
                <span>Welcome, {user?.username}!</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hover:cursor-pointer"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your personal collection of favorite movies and TV shows
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="mb-6 flex flex-col gap-4">
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Input
              placeholder="Search movies, directors, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full sm:min-w-[300px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                variant="outline"
                className="hover:cursor-pointer flex-1 sm:flex-none"
              >
                <FaSearch className="mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    loadMovies();
                  }}
                  className="hover:cursor-pointer"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleLoadAllMovies}
              disabled={loading}
              variant="outline"
              className="hover:cursor-pointer w-full sm:w-auto"
            >
              Load All Movies
            </Button>
            <Button
              onClick={() => setShowFilter(true)}
              disabled={loading}
              variant="outline"
              className="hover:cursor-pointer w-full sm:w-auto"
            >
              <FaFilter className="mr-2" />
              Filter Movies
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              disabled={loading}
              variant="outline"
              className="hover:cursor-pointer w-full sm:w-auto"
            >
              <FaPlus className="mr-2" />
              Add New Movie
            </Button>
          </div>
        </div>

        {/* Movie Table */}
        <div className="bg-white rounded-lg border shadow-sm">
          <MovieTable
            movies={movies}
            onEdit={handleEdit}
            onDelete={handleDeleteMovie}
            onLoadMore={loadMoreMovies}
            hasMore={hasMore}
            isLoading={loading}
          />
        </div>

        {/* Movie Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>
                {editingMovie ? "Edit Movie" : "Add New Movie"}
              </DialogTitle>
            </DialogHeader>
            <MovieForm
              movie={editingMovie}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              isLoading={loading}
            />
          </DialogContent>
        </Dialog>

        {/* Movie Filter Dialog */}
        <MovieFilter
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onApplyFilters={handleApplyFilters}
        />

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={isVisible}
            onClose={hideToast}
          />
        )}
      </div>
    </div>
  );
}

export default App;
