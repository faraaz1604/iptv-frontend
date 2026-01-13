import { Heart, Play, Globe } from "lucide-react";
import { useRef, useState } from "react";

export default function ChannelCard({
  channel,
  isFav,
  onPlay,
  onAddFav,
  onRemoveFav,
}) {
  const cardRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onPlay();
        break;
      case "f":
      case "F":
        e.preventDefault();
        isFav ? onRemoveFav() : onAddFav();
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={cardRef}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      className={`group rounded-lg sm:rounded-xl overflow-hidden bg-white dark:bg-gray-900 border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer outline-none flex flex-col
        ${
          isFocused
            ? "border-red-500 shadow-2xl scale-105 dark:border-red-500"
            : "border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-500 hover:shadow-2xl"
        }`}
      role="button"
      aria-label={`${channel.name}, ${
        channel.category || ""
      } channel. Press Enter to play, F to toggle favorite`}
      aria-pressed={isFav}
    >
      {/* Logo Container */}
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black relative overflow-hidden flex-shrink-0">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <Globe className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-2 opacity-50" />
              <p className="text-xs">No Logo</p>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        <button
          onClick={onPlay}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPlay();
            }
          }}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isFocused
              ? "bg-black/60 opacity-100"
              : "bg-black/0 group-hover:bg-black/60 opacity-0 group-hover:opacity-100"
          }`}
          title="Play channel (Press Enter or Space)"
          aria-label={`Play ${channel.name}`}
        >
          <div className="bg-red-500 p-2 sm:p-3 rounded-full group-hover:bg-red-600 transition-colors transform group-hover:scale-125 min-w-[40px] min-h-[40px] flex items-center justify-center">
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white" />
          </div>
        </button>

        {/* Favorite Button */}
        <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
          <button
            onClick={isFav ? onRemoveFav : onAddFav}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                isFav ? onRemoveFav() : onAddFav();
              }
            }}
            title={
              isFav
                ? "Remove from favorites (F key)"
                : "Add to favorites (F key)"
            }
            aria-label={
              isFav
                ? `Remove ${channel.name} from favorites`
                : `Add ${channel.name} to favorites`
            }
            aria-pressed={isFav}
            className="flex-shrink-0 p-1.5 sm:p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition ${
                isFav
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="p-2 sm:p-3 space-y-1 sm:space-y-2 flex-1 flex flex-col">
        <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1 sm:line-clamp-2 group-hover:text-red-500 transition-colors">
          {channel.name}
        </p>

        <div className="flex flex-col gap-0.5 sm:gap-1 flex-1">
          {channel.category && (
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate bg-gray-100 dark:bg-gray-800 px-2 py-0.5 sm:py-1 rounded">
              {channel.category}
            </span>
          )}

          {channel.country && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 sm:py-1 rounded">
              {channel.country}
            </span>
          )}
        </div>

        {channel.language && (
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {channel.language}
          </span>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      {isFocused && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 text-center rounded-t-lg">
          <p>
            Press{" "}
            <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">
              Enter
            </kbd>{" "}
            to play
          </p>
        </div>
      )}
    </div>
  );
}
