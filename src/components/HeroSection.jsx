import { Play, Zap, Globe } from 'lucide-react';

export default function HeroSection({ totalChannels, totalCountries }) {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-red-900/20 to-black py-16 px-6 rounded-2xl mb-8 border border-red-500/30 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-red-300">Live & Ready to Stream</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Welcome to IPTV Player
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-gray-300 mb-6 max-w-2xl leading-relaxed">
          Your ultimate destination for streaming live TV channels from around the world. Enjoy thousands of channels in multiple categories with advanced search and filtering.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Globe className="w-5 h-5" />}
            label="Countries"
            value={totalCountries || '150+'}
          />
          <StatCard
            icon={<Play className="w-5 h-5" />}
            label="Live Channels"
            value={totalChannels || '5000+'}
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Categories"
            value="30+"
          />
        </div>

        {/* Features Quick List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Feature text="🔍 Advanced Search & Filters" />
          <Feature text="❤️ Save Your Favorites" />
          <Feature text="📺 Watch History Tracking" />
          <Feature text="🌙 Beautiful Dark Mode" />
          <Feature text="📱 Works on All Devices" />
          <Feature text="⚡ Lightning Fast Loading" />
        </div>

        {/* CTA Button */}
        <div className="flex flex-wrap gap-4">
          <button className="group px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Start Watching Now
          </button>
          <button className="px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 opacity-20 animate-float">
        <div className="text-6xl">📺</div>
      </div>
      <div className="absolute bottom-10 left-10 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="text-6xl">🎬</div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-red-500">{icon}</div>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-2 text-gray-200">
      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
      <span className="text-sm">{text}</span>
    </div>
  );
}