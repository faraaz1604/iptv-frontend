import { Heart, Github, Code2, Mail, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">

      {/* ===== TOP SECTION ===== */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4 md:pl-6 lg:pl-10">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">IPTV Player</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              A modern, responsive IPTV streaming application built with
              cutting-edge web technologies.
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Heart className="w-4 h-4 text-red-500" />
              Built with passion for streaming enthusiasts
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                'Live Channel Streaming',
                'Advanced Filtering & Search',
                'Favorites Management',
                'Watch History Tracking',
                'Dark Mode Support',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Documentation', '#'],
                ['API Reference', '#'],
                ['GitHub Repository', 'https://github.com/faraaz1604'],
                ['Report Issues', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
              ].map(([label, link]) => (
                <li key={label}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition flex items-center gap-2"
                  >
                    → {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {[
                [Github, 'https://github.com/faraaz1604'],
                [Mail, 'mailto:mohamedfaraaz007@gmail.com'],
                [Linkedin, 'https://www.linkedin.com/in/mohamed-faraaz-7b9511222/'],
              ].map(([Icon, link], i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-gray-100 dark:bg-gray-800 hover:bg-red-500 rounded-lg transition"
                >
                  <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white transition" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== LEGAL / DISCLAIMER ===== */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 text-sm">

          {/* Left */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Developed by:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300">Mohamed Faraaz</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              © {currentYear} IPTV Player. All rights reserved.
            </p>

            <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                <strong>📚 Educational Purpose:</strong> This project is built for
                learning and demonstration of modern web development practices.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="md:pl-10 lg:pl-16">
            <h5 className="text-gray-900 dark:text-white font-semibold mb-2">
              Legal Information
            </h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Application provided as-is</li>
              <li>• Users must comply with local laws</li>
              <li>• Stream only authorized content</li>
              <li>• Data stored locally in browser</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="bg-gray-100 dark:bg-black py-4 text-center text-xs text-gray-600 dark:text-gray-400">
        Built with <span className="text-red-500">❤️</span> using React & Tailwind CSS
      </div>
    </footer>
  );
}