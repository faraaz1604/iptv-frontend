import { Tv, LogOut, Sun, Moon, Menu, User } from "lucide-react";
import { useState } from "react";

export default function Header({
  dark,
  setDark,
  refreshing,
  onRefresh,
  onLogout,
  onMenuClick,
  isOnline,
  username = "User", // New prop for username
}) {
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);

  return (
    <header className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-1.5 sm:p-2 rounded-lg shadow-lg flex-shrink-0">
            <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent truncate">
              IPTV Player
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Stream Live TV
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex gap-1 sm:gap-2 md:gap-3 items-center flex-shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 min-w-[40px] min-h-[44px] justify-center sm:justify-start"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <>
                <Sun className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl min-w-[40px] min-h-[44px] justify-center sm:justify-start ${
              refreshing ? "opacity-75" : ""
            }`}
            title="Refresh playlist from server"
          >
            <span
              className={`inline-block flex-shrink-0 ${
                refreshing ? "animate-spin" : ""
              }`}
            >
              🔄
            </span>
            <span className="hidden sm:inline">
              {refreshing ? "Loading..." : "Refresh"}
            </span>
          </button>

          {/* User Profile / Logout Button */}
          <div className="relative">
            <button
              onClick={onLogout}
              onMouseEnter={() => setShowLogoutTooltip(true)}
              onMouseLeave={() => setShowLogoutTooltip(false)}
              className="px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 border border-gray-300 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-600 min-w-[40px] min-h-[44px] justify-center sm:justify-start group"
            >
              <User className="w-4 h-4 flex-shrink-0 sm:hidden group-hover:hidden" />
              <LogOut className="w-4 h-4 flex-shrink-0 hidden sm:group-hover:inline" />
              
              {/* Username display */}
              <span className="hidden sm:inline truncate max-w-[120px] group-hover:hidden">
                {username}
              </span>
              
              {/* Logout text on hover */}
              <span className="hidden sm:group-hover:inline">
                Logout
              </span>
            </button>

            {/* Tooltip for mobile and extra clarity */}
            {showLogoutTooltip && (
              <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none">
                Click to logout
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"></div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {refreshing && (
        <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 font-medium">
              Refreshing playlist... This may take up to 60 seconds
            </p>
          </div>
        </div>
      )}
    </header>
  );
}