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
import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import { Toast } from "@/components/Toast";
import { apiService } from "@/services/api";
import { authService, type User } from "@/services/authService";
import { useToast } from "@/hooks/useToast";
import type { Movie, NewMovie } from "@/types/movie";
import {
  FaFilm,
  FaSearch,
  FaFilter,
  FaPlus,
  FaUser,
  FaSignOutAlt,
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
  // State variables to store our data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Toast hook for showing notifications
  const { toast, isVisible, hideToast, showSuccess, showError, showInfo } =
    useToast();

  // Check if user is logged in when the app starts
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

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

  // Function to handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      const response = await authService.login(email, password);

      // Store user data and token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      setShowLogin(false);
      showSuccess("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      showError("Login failed. Please check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Function to handle signup
  const handleSignup = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      setAuthLoading(true);
      const response = await authService.signup(name, email, password);

      // Store user data and token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      setShowSignup(false);
      showSuccess("Account created successfully!");
    } catch (error) {
      console.error("Signup failed:", error);
      showError("Signup failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMovies([]);
    showInfo("Logged out successfully!");
  };

  // Function to switch between login and signup
  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  // If user is not logged in, show login/signup
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <FaFilm className="text-blue-600 text-4xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              My Favorite Movies & TV Shows
            </h1>
            <p className="text-gray-600">
              Manage your personal collection of favorite movies and TV shows
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setShowLogin(true)}
              variant="outline"
              className="w-full hover:cursor-pointer"
            >
              <FaUser className="mr-2" />
              Login
            </Button>
            <Button
              onClick={() => setShowSignup(true)}
              variant="outline"
              className="w-full hover:cursor-pointer"
            >
              Create Account
            </Button>
          </div>

          {/* Login Form */}
          <LoginForm
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
            onLogin={handleLogin}
            onSwitchToSignup={handleSwitchToSignup}
            isLoading={authLoading}
          />

          {/* Signup Form */}
          <SignupForm
            isOpen={showSignup}
            onClose={() => setShowSignup(false)}
            onSignup={handleSignup}
            onSwitchToLogin={handleSwitchToLogin}
            onPasswordMismatch={() => showError("Passwords do not match!")}
            isLoading={authLoading}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2">
              <FaFilm className="text-blue-600" />
              My Favorite Movies & TV Shows
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Welcome, {user.name}!
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hover:cursor-pointer"
              >
                <FaSignOutAlt className="mr-1" />
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
              Load My Movies
            </Button>
            <Button
              onClick={() => setShowFilter(true)}
              disabled={loading}
              variant="outline"
              className="hover:cursor-pointer w-full sm:w-auto"
            >
              <FaFilter className="mr-2" />
              Filter My Movies
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
