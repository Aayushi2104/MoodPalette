import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PaletteGenerator from './components/PaletteGenerator';
import Home from './pages/Home';
import SavedPalettes from './pages/SavedPalettes';
import PublicGallery from './pages/PublicGallery';
import Login from './pages/Login';
import Register from './pages/Register';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setIsDark(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="group px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 bg-white/10 text-white/80 hover:text-white hover:bg-white/20 hover:backdrop-blur-sm border border-white/20"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-lg group-hover:animate-bounce-gentle">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/generate', label: 'Generate', icon: '🎨' },
    { path: '/saved', label: 'Saved', icon: '💾' },
    { path: '/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/login', label: 'Login', icon: '👤' }
  ];

  return (
    <nav className="glass-effect backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-bold flex items-center space-x-3 text-white hover:text-mood-cyan transition-colors duration-300 font-display">
            <div className="relative">
              <span className="text-4xl animate-bounce-gentle">🎨</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-mood-pink rounded-full animate-sparkle"></div>
            </div>
            <span className="gradient-text bg-gradient-to-r from-white to-mood-cyan bg-clip-text text-transparent">
              MoodPalette
            </span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 group overflow-hidden ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white shadow-glow backdrop-blur-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                  }`}
                >
                  <span className="text-lg group-hover:animate-bounce-gentle">{item.icon}</span>
                  <span className="relative z-10 hidden sm:inline">{item.label}</span>
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-mood-purple/20 to-mood-blue/20 animate-gradient-shift"></div>
                  )}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen theme-transition">
        {/* Animated background particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20 animate-float-trail"
              style={{
                background: `linear-gradient(45deg, #8B5CF6, #3B82F6, #EC4899)`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>
        
        <Navigation />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<PaletteGenerator />} />
            <Route path="/saved" element={<SavedPalettes />} />
            <Route path="/gallery" element={<PublicGallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        
        {/* Footer with gradient */}
        <footer className="relative z-10 glass-effect backdrop-blur-lg border-t border-white/20 mt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center text-white/80 dark:text-gray-300">
              <p className="text-sm font-medium">
                Made with <span className="text-mood-pink animate-pulse">💜</span> by the MoodPalette Team
              </p>
              <p className="text-xs mt-2 opacity-60">
                Create, Save, and Share Beautiful Color Palettes
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
