import { useState } from "react";
import { login } from "../services/authApi";
import { useToast } from "../context/ToastContext";
import { Loader } from "lucide-react";

export default function Login({ onLogin, isOnline }) {
  const toast = useToast();

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username) => {
    try {
      setLoading(true);

      if (!username || username.trim() === "") {
        toast.warning("Username is required");
        return;
      }

      if (!isOnline) {
        toast.error("You are offline. Please check your connection.");
        return;
      }

      console.log("Logging in as:", username);
      await login(username);

      toast.success("✓ Login successful!");

      setTimeout(() => {
        onLogin();
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(userId);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-gray-100 to-gray-200 
                    dark:from-gray-900 dark:to-gray-950 
                    px-4 sm:px-6"
    >
      <div
        className="bg-white dark:bg-gray-900 
                      p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl 
                      w-full max-w-md"
      >
        {/* Title */}
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-2 
                       text-gray-900 dark:text-gray-100"
        >
          Welcome to IPTV
        </h2>

        <p
          className="text-center text-xs sm:text-sm mb-6 
                      text-gray-500 dark:text-gray-400"
        >
          Watch your favorite channels instantly
        </p>

        {/* Offline Notice */}
        {!isOnline && (
          <div
            className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 
                          border border-yellow-400 dark:border-yellow-700 
                          rounded-lg text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm text-center font-semibold"
          >
            You are offline. Login is not available.
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs sm:text-sm font-medium mb-2 
                              text-gray-700 dark:text-gray-300"
            >
              Username
            </label>

            <input
              type="text"
              placeholder="Enter Your Name"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading || !isOnline}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg
                         border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-800
                         text-gray-900 dark:text-gray-100
                         placeholder-gray-400 text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-red-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isOnline}
            className="w-full py-2 sm:py-3 rounded-lg
                       bg-red-500 hover:bg-red-600
                       text-white font-semibold text-sm sm:text-base
                       transition disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          <span className="px-3 text-xs sm:text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Guest Login */}
        <button
          onClick={() => handleLogin("guest")}
          disabled={loading || !isOnline}
          className="w-full py-2 sm:py-3 rounded-lg
                     border border-gray-400 dark:border-gray-600
                     text-gray-700 dark:text-gray-300 text-sm sm:text-base
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     hover:text-gray-900 dark:hover:text-white
                     transition font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Continue as Guest"
          )}
        </button>
      </div>
    </div>
  );
}
