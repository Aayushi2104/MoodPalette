import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen relative">
    {/* Hero Section */}
    <div className="relative py-20 px-6">
      <div className="container mx-auto text-center">
        {/* Animated title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight font-display">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-mood-cyan via-mood-purple to-mood-pink bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
              MoodPalette
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-black/80 dark:text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed">
            Generate, save, and share beautiful color palettes based on mood, country, or personality!
          </p>
          <div className="flex justify-center items-center space-x-2 text-black/60 dark:text-white/60">
            <span className="w-2 h-2 bg-mood-cyan rounded-full animate-pulse"></span>
            <span className="text-sm">AI-Powered Color Generation</span>
            <span className="w-2 h-2 bg-mood-pink rounded-full animate-pulse"></span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-slide-up">
          <Link to="/generate" className="group">
            <div className="glass-effect backdrop-blur-lg p-8 rounded-2xl border border-white/20 card-hover relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mood-purple/10 to-mood-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:animate-bounce-gentle transition-transform duration-300">🎨</div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3 group-hover:text-mood-cyan transition-colors">
                  Generate Palettes
                </h3>
                <p className="text-black/70 dark:text-white/70 group-hover:text-black/90 dark:group-hover:text-white/90 transition-colors">
                  Create stunning color palettes based on your mood or inspired by different countries using AI.
                </p>
                <div className="mt-4 inline-flex items-center text-mood-cyan group-hover:text-black dark:group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Start Creating</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
          
          <Link to="/gallery" className="group">
            <div className="glass-effect backdrop-blur-lg p-8 rounded-2xl border border-white/20 card-hover relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mood-pink/10 to-mood-rose/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:animate-bounce-gentle transition-transform duration-300">🖼️</div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3 group-hover:text-mood-pink transition-colors">
                  Public Gallery
                </h3>
                <p className="text-black/70 dark:text-white/70 group-hover:text-black/90 dark:group-hover:text-white/90 transition-colors">
                  Explore beautiful palettes shared by our creative community from around the world.
                </p>
                <div className="mt-4 inline-flex items-center text-mood-pink group-hover:text-black dark:group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Browse Gallery</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/saved" className="group">
            <div className="glass-effect backdrop-blur-lg p-8 rounded-2xl border border-white/20 card-hover relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mood-emerald/10 to-mood-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:animate-bounce-gentle transition-transform duration-300">💾</div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3 group-hover:text-mood-emerald transition-colors">
                  Your Collection
                </h3>
                <p className="text-black/70 dark:text-white/70 group-hover:text-black/90 dark:group-hover:text-white/90 transition-colors">
                  Access and manage your saved color palettes. Keep track of your creative journey.
                </p>
                <div className="mt-4 inline-flex items-center text-mood-emerald group-hover:text-black dark:group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">View Saved</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="glass-effect backdrop-blur-lg rounded-3xl p-10 relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-mood-purple/20 via-mood-blue/20 to-mood-pink/20 animate-gradient-shift bg-[length:200%_200%]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-black/80 dark:text-white/80 mb-8 max-w-2xl mx-auto">
              Create your first mood-based color palette now and discover the perfect colors for your next project!
            </p>
            <Link 
              to="/generate" 
              className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-mood-purple to-mood-blue text-white font-bold text-lg rounded-2xl shadow-glow hover:shadow-glow-blue transition-all duration-300 hover:scale-105"
            >
              <span>Start Generating</span>
              <span className="ml-3 text-2xl group-hover:animate-bounce-gentle">🚀</span>
            </Link>
          </div>
        </div>

        {/* Features highlight */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
          {[
            { icon: '🤖', label: 'AI-Powered', desc: 'Smart suggestions' },
            { icon: '🌍', label: 'Global', desc: 'Country themes' },
            { icon: '🎭', label: 'Mood-Based', desc: 'Emotion colors' },
            { icon: '🎨', label: 'Creative', desc: 'Unlimited palettes' }
          ].map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl mb-2 group-hover:animate-bounce-gentle transition-transform duration-300">
                {feature.icon}
              </div>
              <h4 className="text-black dark:text-white font-semibold mb-1">{feature.label}</h4>
              <p className="text-black/60 dark:text-white/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Home;
