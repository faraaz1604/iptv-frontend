import { useEffect, useState, useMemo, useRef } from "react";
import { api } from "../services/channelApi";
import { getDisplayName } from "../services/authApi"; // Add this import
import { useToast } from "../context/ToastContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChannelCard from "../components/ChannelCard";
import VideoPlayer from "../components/VideoPlayer";
import Footer from "../components/Footer";
import { Filter, AlertCircle, RotateCcw, X } from "lucide-react";

const PAGE_SIZE = 20;

export default function Home({ dark, setDark, onLogout, isOnline }) {
  const toast = useToast();
  const videoPlayerRef = useRef(null);

  const [channels, setChannels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [countries, setCountries] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [country, setCountry] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get username from localStorage
  const username = getDisplayName() || "User";

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [cat, country, search]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      if (!isOnline) {
        setError("You are offline. Cannot load data.");
        toast.warning("You are offline");
        setChannels([]);
        setFavorites([]);
        setRecent([]);
        setLoading(false);
        return;
      }

      const [
        channelsData,
        favoritesData,
        recentData,
        categoriesData,
        countriesData,
      ] = await Promise.all([
        api.getChannels(),
        api.getFavorites(),
        api.getRecentlyWatched(10),
        api.getCategories(),
        api.getCountries(),
      ]);

      if (!channelsData || channelsData.length === 0) {
        setError("No channels available. Please try again.");
        toast.error("No channels available");
        setChannels([]);
        return;
      }

      setChannels(channelsData || []);
      setFavorites(favoritesData || []);
      setRecent(recentData || []);

      if (categoriesData?.length) {
        const clean = Array.from(
          new Set(
            categoriesData.flatMap((c) =>
              String(c)
                .split(";")
                .map((x) => x.trim())
                .filter(Boolean)
            )
          )
        ).sort();
        setCategories(["All", ...clean]);
      }

      if (countriesData?.length) {
        const clean = Array.from(
          new Set(countriesData.map((c) => String(c).trim()).filter(Boolean))
        ).sort();
        setCountries(["All", ...clean]);
      }
    } catch (e) {
      console.error("Error loading data:", e);
      setError(
        e.message || "Failed to load data. Please check your connection."
      );
      toast.error(e.message || "Failed to load channels");
      setChannels([]);
      setFavorites([]);
      setRecent([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return channels.filter((c) => {
      const matchesSearch =
        !search || c.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        cat === "All" || (c.category && c.category === cat);
      const matchesCountry =
        country === "All" || (c.country && c.country === country);

      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [channels, search, cat, country]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const handlePlay = async (ch) => {
    if (!isOnline) {
      toast.error("You are offline. Cannot play channel.");
      return;
    }

    setSelected(ch);
    setMobileMenuOpen(false);

    setTimeout(() => {
      videoPlayerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);

    try {
      await api.watchChannel(ch.id);
      setRecent(await api.getRecentlyWatched(10));
      toast.success("Watch recorded");
    } catch (e) {
      console.error("Error playing channel:", e);
      toast.error(e.message || "Failed to record watch");
    }
  };

  const handleAddFav = async (id) => {
    if (!isOnline) {
      toast.error("You are offline. Cannot add favorite.");
      return;
    }

    try {
      await api.toggleFavorite(id, false);
      setFavorites(await api.getFavorites());
      toast.success("✓ Added to favorites");
    } catch (e) {
      console.error("Error adding favorite:", e);
      toast.error(e.message || "Failed to add favorite");
    }
  };

  const handleRemoveFav = async (id) => {
    if (!isOnline) {
      toast.error("You are offline. Cannot remove favorite.");
      return;
    }

    try {
      await api.toggleFavorite(id, true);
      setFavorites(await api.getFavorites());
      toast.success("✓ Removed from favorites");
    } catch (e) {
      console.error("Error removing favorite:", e);
      toast.error(e.message || "Failed to remove favorite");
    }
  };

  const handleRemoveRecent = async (id) => {
    if (!isOnline) {
      toast.error("You are offline. Cannot remove from history.");
      return;
    }

    try {
      await api.removeRecentlyWatched(id);
      setRecent(await api.getRecentlyWatched(10));
      toast.success("✓ Removed from history");
    } catch (e) {
      console.error("Error removing recent:", e);
      toast.error(e.message || "Failed to remove from history");
    }
  };

  const handleRefresh = async () => {
    if (!isOnline) {
      toast.error("You are offline. Cannot refresh playlist.");
      return;
    }

    try {
      setRefreshing(true);
      await api.refreshPlaylist();
      await load();
      toast.success("✓ Playlist refreshed successfully");
    } catch (e) {
      console.error("Error refreshing playlist:", e);
      toast.error(e.message || "Failed to refresh playlist");
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCat("All");
    setCountry("All");
    setPage(1);
  };

  const hasActiveFilters = search || cat !== "All" || country !== "All";

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
        <Header
          dark={dark}
          setDark={setDark}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLogout={onLogout}
          isOnline={isOnline}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          username={username} // Pass username here
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar
              search={search}
              setSearch={setSearch}
              categories={categories}
              selectedCategory={cat}
              setSelectedCategory={setCat}
              countries={countries}
              selectedCountry={country}
              setSelectedCountry={setCountry}
              favorites={favorites}
              recentlyWatched={recent}
              onPlay={handlePlay}
              onRemoveFav={handleRemoveFav}
              onRemoveRecent={handleRemoveRecent}
            />
          </div>

          {/* Mobile Sidebar Modal */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 md:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
              />

              <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[90vw] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                  <h2 className="font-bold text-lg">Filters</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4">
                  <Sidebar
                    search={search}
                    setSearch={setSearch}
                    categories={categories}
                    selectedCategory={cat}
                    setSelectedCategory={setCat}
                    countries={countries}
                    selectedCountry={country}
                    setSelectedCountry={setCountry}
                    favorites={favorites}
                    recentlyWatched={recent}
                    onPlay={handlePlay}
                    onRemoveFav={handleRemoveFav}
                    onRemoveRecent={handleRemoveRecent}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto w-full">
              {/* Video Player */}
              {!loading && selected && (
                <div
                  ref={videoPlayerRef}
                  className="sticky top-0 z-40 mb-6 sm:mb-8"
                >
                  <VideoPlayer
                    channel={selected}
                    onClose={() => setSelected(null)}
                  />
                </div>
              )}

              {/* Filter Info */}
              {!loading && channels.length > 0 && (
                <div className="mb-4 sm:mb-6 bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-xl">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">
                        Active Filters
                      </span>
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs sm:text-sm bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-red-600 transition whitespace-nowrap"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Channel Grid */}
              {!loading && channels.length > 0 && paged.length > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                    {paged.map((ch) => (
                      <ChannelCard
                        key={ch.id}
                        channel={ch}
                        isFav={favorites.some((f) => f.id === ch.id)}
                        onPlay={() => handlePlay(ch)}
                        onAddFav={() => handleAddFav(ch.id)}
                        onRemoveFav={() => handleRemoveFav(ch.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 py-6 sm:py-8">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-3 sm:px-4 py-2 bg-red-500 text-white text-sm sm:text-base rounded disabled:opacity-50 hover:bg-red-600 transition"
                    >
                      Prev
                    </button>
                    <span className="font-semibold py-2 text-sm sm:text-base">
                      Page {page} / {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3 sm:px-4 py-2 bg-red-500 text-white text-sm sm:text-base rounded disabled:opacity-50 hover:bg-red-600 transition"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {!loading && channels.length > 0 && filtered.length === 0 && (
                <div className="text-center py-12 sm:py-20 text-gray-500">
                  <p className="text-base sm:text-lg font-semibold mb-2">
                    No channels found
                  </p>
                  <p className="text-xs sm:text-sm">
                    Try adjusting your filters or search term
                  </p>
                </div>
              )}

              {!loading && channels.length === 0 && !error && (
                <div className="text-center py-12 sm:py-20 text-gray-500">
                  <p className="text-base sm:text-lg font-semibold">
                    No data available
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}