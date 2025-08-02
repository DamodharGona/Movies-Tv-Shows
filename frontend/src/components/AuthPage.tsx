import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Toast } from "./Toast";
import { FaFilm } from "react-icons/fa";

type AuthMode = "login" | "signup";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast, isVisible, hideToast, showSuccess, showError } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      showSuccess("Login successful! Welcome back.");
    } catch (error: any) {
      showError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await register(username, email, password);
      showSuccess("Registration successful! Welcome to your movie collection.");
    } catch (error: any) {
      showError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = () => setMode("signup");
  const switchToLogin = () => setMode("login");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaFilm className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Favourite Tv & Movie Shows
          </h1>
          <p className="text-gray-600">
            {mode === "login" 
              ? "Sign in to manage your movie collection" 
              : "Create an account to start your movie collection"
            }
          </p>
        </div>

        {/* Auth Form */}
        {mode === "login" ? (
          <LoginForm
            onSubmit={handleLogin}
            onSwitchToSignup={switchToSignup}
            isLoading={isLoading}
          />
        ) : (
          <SignupForm
            onSubmit={handleRegister}
            onSwitchToLogin={switchToLogin}
            isLoading={isLoading}
          />
        )}

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