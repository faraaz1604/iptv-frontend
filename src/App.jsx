import { useEffect, useState, useCallback } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ToastProvider } from "./context/ToastContext";
import OfflineBanner from "./components/OfflineBanner";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { getToken, logout } from "./services/authApi";

function AppContent() {
  const [dark, setDark] = useState(true);
  const isOnline = useNetworkStatus();

  const [loggedIn, setLoggedIn] = useState(() => {
    const token = getToken();
    return !!token;
  });

  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!loggedIn) return;

    const checkTokenInterval = setInterval(() => {
      const token = getToken();

      if (!token) {
        console.warn("Token not found - logging out");
        setError("Your session has expired. Redirecting to login...");
        setLoggedIn(false);
        return;
      }

      try {
        const parts = token.split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid token format");
        }

        const payload = JSON.parse(atob(parts[1]));
        const expiryTime = payload.exp * 1000;
        const currentTime = Date.now();

        if (currentTime >= expiryTime) {
          console.warn("Token has expired");
          setError("Your session has expired. Redirecting to login...");
          logout();
          setLoggedIn(false);
        }
      } catch (err) {
        console.error("Error checking token:", err);
        setError("Session validation failed. Logging out...");
        logout();
        setLoggedIn(false);
      }
    }, 60000);

    return () => clearInterval(checkTokenInterval);
  }, [loggedIn]);

  const handleLogin = useCallback(() => {
    setError("");
    setLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    try {
      setError("");
      logout();
      setLoggedIn(false);
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed. Please refresh the page.");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <OfflineBanner isOnline={isOnline} />

      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 sm:p-4 text-center z-50 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-medium flex-1">{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-2 sm:ml-4 underline hover:opacity-80 font-semibold text-xs sm:text-sm whitespace-nowrap"
          >
            Dismiss
          </button>
        </div>
      )}

      {loggedIn ? (
        <Home
          dark={dark}
          setDark={setDark}
          onLogout={handleLogout}
          isOnline={isOnline}
        />
      ) : (
        <Login onLogin={handleLogin} isOnline={isOnline} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
