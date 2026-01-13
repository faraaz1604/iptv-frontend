import { Wifi, WifiOff } from "lucide-react";

export default function OfflineBanner({ isOnline }) {
  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 px-6 py-3 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <WifiOff className="w-5 h-5 animate-pulse" />
        <p className="font-semibold text-center">
          You are offline. Some features may not be available.
        </p>
        <WifiOff className="w-5 h-5 animate-pulse" />
      </div>
    </div>
  );
}
