import { X, Flag, AlertCircle, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function VideoPlayer({ channel, onClose }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  if (!channel) return null;

  const handleVideoError = (e) => {
    console.error("Video playback error:", e);
    setIsLoading(false);
    setError(
      "Failed to load video stream. The channel URL may be invalid or offline."
    );
  };

  const handleVideoLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleVideoCanPlay = () => {
    setIsLoading(false);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
  };

  return (
    <div className="mb-4 sm:mb-6 md:mb-8 bg-black shadow-2xl border-2 border-red-500 rounded-lg sm:rounded-2xl overflow-hidden">
      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        {/* Loading Spinner */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <div className="animate-spin">
                <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-white text-xs sm:text-sm font-medium">
                Loading stream...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30">
            <div className="text-center text-white px-4 sm:px-6">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-2 sm:mb-4" />
              <h3 className="font-bold text-lg sm:text-xl mb-2">
                Playback Error
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
                {error}
              </p>

              <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition text-xs sm:text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>

                <button
                  onClick={onClose}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition text-xs sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Player */}
        <video
          key={channel.channelUrl}
          src={channel.channelUrl}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
          onError={handleVideoError}
          onLoadStart={handleVideoLoadStart}
          onCanPlay={handleVideoCanPlay}
          onPlayCapture={() => setError(null)}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          title="Close video player (Esc key)"
          className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 p-1.5 sm:p-2 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition transform hover:scale-110 min-w-[40px] min-h-[40px] flex items-center justify-center"
          aria-label="Close video player"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Channel URL Display */}
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-40 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded hidden hover:flex gap-2">
          <span className="truncate max-w-[200px]">
            URL: {channel.channelUrl.substring(0, 40)}...
          </span>
        </div>
      </div>

      {/* Channel Info */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-4 md:p-6 border-t-2 border-red-500">
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-white mb-2 sm:mb-3 line-clamp-2">
          {channel.name}
        </h2>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {channel.category && (
            <span className="text-xs sm:text-sm bg-purple-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              {channel.category}
            </span>
          )}

          {channel.country && (
            <span className="text-xs sm:text-sm bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1">
              <Flag className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {channel.country}
            </span>
          )}

          {channel.language && (
            <span className="text-xs sm:text-sm bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              {channel.language}
            </span>
          )}
        </div>

        {/* Stream Status Indicator */}
        <div className="mt-3 sm:mt-4 text-xs text-gray-400">
          {error ? (
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></span>
              Stream unavailable
            </span>
          ) : isLoading ? (
            <span className="flex items-center gap-1 text-yellow-400">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse flex-shrink-0"></span>
              Connecting...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
              Live
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
