import { Search, Heart, Globe, Zap, Moon, Smartphone } from "lucide-react";

export default function FeaturesShowcase() {
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Search channels by name, category, country, and language with real-time filtering",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Heart,
      title: "Favorites & History",
      description:
        "Save your favorite channels and automatic tracking of recently watched channels",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Globe,
      title: "Global Channels",
      description:
        "Access thousands of TV channels from countries around the world",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized performance with instant channel loading and smooth playback",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Moon,
      title: "Dark Mode",
      description:
        "Beautiful dark theme that is easy on the eyes, perfect for night viewing",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Works seamlessly on desktop, tablet, and mobile devices",
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need for the ultimate streaming experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Background Gradient Accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`bg-gradient-to-br ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Arrow Accent */}
                  <div className="mt-4 flex items-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Learn more</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section (Optional) */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-red-500 mb-2">5000+</div>
            <p className="text-gray-600 dark:text-gray-400">Live Channels</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-red-500 mb-2">150+</div>
            <p className="text-gray-600 dark:text-gray-400">Countries</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-red-500 mb-2">30+</div>
            <p className="text-gray-600 dark:text-gray-400">Categories</p>
          </div>
        </div>
      </div>
    </section>
  );
}
