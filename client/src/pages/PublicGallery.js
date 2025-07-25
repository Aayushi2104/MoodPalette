import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const PublicGallery = () => {
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicPalettes();
  }, []);

  const fetchPublicPalettes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.PALETTE.PUBLIC);
      if (!res.ok) throw new Error('Failed to fetch palettes');
      const data = await res.json();
      setPalettes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (colors) => {
    const colorString = colors.join(', ');
    navigator.clipboard.writeText(colorString);
    alert('Colors copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-6 flex items-center space-x-3">
              <span className="text-4xl">🖼️</span>
              <span className="bg-gradient-to-r from-mood-pink to-mood-rose bg-clip-text text-transparent">
                Public Gallery
              </span>
            </h2>
            <div className="flex items-center justify-center py-12">
              <div className="inline-flex items-center space-x-3 text-black/80 dark:text-white/80">
                <div className="w-6 h-6 border-2 border-black/30 dark:border-white/30 border-t-black dark:border-t-white rounded-full animate-spin"></div>
                <span className="text-lg">Loading amazing palettes...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-6 flex items-center space-x-3">
              <span className="text-4xl">🖼️</span>
              <span className="bg-gradient-to-r from-mood-pink to-mood-rose bg-clip-text text-transparent">
                Public Gallery
              </span>
            </h2>
            <div className="glass-effect backdrop-blur-sm border border-red-400/30 rounded-xl p-6 bg-gradient-to-r from-red-500/20 to-orange-500/20">
              <div className="flex items-center text-red-200 mb-4">
                <span className="text-2xl mr-3">⚠️</span>
                <p className="text-lg">Error: {error}</p>
              </div>
              <button 
                onClick={fetchPublicPalettes}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:scale-105"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white flex items-center space-x-3">
              <span className="text-4xl animate-bounce-gentle">🖼️</span>
              <span className="bg-gradient-to-r from-mood-pink to-mood-rose bg-clip-text text-transparent">
                Public Gallery
              </span>
            </h2>
            <button 
              onClick={fetchPublicPalettes}
              className="group px-6 py-3 bg-gradient-to-r from-mood-pink to-mood-rose text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-glow-pink flex items-center space-x-2"
            >
              <span className="text-lg group-hover:animate-bounce-gentle">🔄</span>
              <span>Refresh</span>
            </button>
          </div>
          <p className="text-black/70 dark:text-white/70 mt-4 text-lg">
            Explore beautiful palettes shared by our creative community from around the world
          </p>
        </div>
        
        {palettes.length === 0 ? (
          <div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center animate-slide-up">
            <div className="text-8xl mb-6 animate-bounce-gentle">🎨</div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">No public palettes yet</h3>
            <p className="text-black/60 dark:text-white/60 mb-8 text-lg max-w-md mx-auto">
              Be the first to share a palette with the community! Create something beautiful and make it public.
            </p>
            <a 
              href="/generate" 
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-mood-pink to-mood-rose text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold text-lg shadow-glow-pink hover:shadow-glow-pink"
            >
              <span className="mr-3 text-xl group-hover:animate-bounce-gentle">🎨</span>
              <span>Create & Share First Palette</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {palettes.map((palette) => (
              <div key={palette._id} className="glass-effect backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:shadow-glow transition-all duration-300 group card-hover">
                {/* Color Strip */}
                <div className="flex h-40 relative overflow-hidden">
                  {palette.colors.map((color, i) => (
                    <div 
                      key={i} 
                      className="flex-1 relative group/color cursor-pointer transition-all duration-300"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard([color])}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-xs font-mono opacity-0 group-hover/color:opacity-100 transition-opacity duration-300 font-semibold bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                          {color}
                        </span>
                      </div>
                      {/* Sparkle effect */}
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white/60 rounded-full animate-sparkle"></div>
                    </div>
                  ))}
                  
                  {/* Floating action hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 dark:bg-black/90 text-black dark:text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-white/20">
                      Click colors to copy individually
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 bg-white/5 dark:bg-black/20 backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-black dark:text-white capitalize text-lg flex items-center space-x-2">
                          <span className="text-2xl">
                            {palette.mood === 'calm' ? '🧘' : 
                             palette.mood === 'romantic' ? '💕' : 
                             palette.mood === 'energetic' ? '⚡' : 
                             palette.mood === 'random' ? '🎲' : '🎨'}
                          </span>
                          <span>{palette.mood}</span>
                          {palette.country && (
                            <span className="text-black/60 dark:text-white/60 text-base">
                              ({palette.country})
                            </span>
                          )}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-400/30 flex items-center space-x-1">
                          <span>🌍</span>
                          <span>Community</span>
                        </span>
                        <span className="text-xs text-black/50 dark:text-white/50 bg-black/10 dark:bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                          {new Date(palette.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Color Codes */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {palette.colors.map((color, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-black/20 dark:bg-white/20 text-black dark:text-white px-3 py-2 rounded-lg font-mono cursor-pointer hover:bg-black/30 dark:hover:bg-white/30 transition-all duration-300 border border-white/10"
                        onClick={() => copyToClipboard([color])}
                        title="Click to copy"
                      >
                        {color}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => copyToClipboard(palette.colors)}
                    className="group w-full px-4 py-3 bg-gradient-to-r from-mood-pink to-mood-rose text-white text-sm rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-glow-pink flex items-center justify-center space-x-2"
                  >
                    <span className="text-lg group-hover:animate-bounce-gentle">📋</span>
                    <span>Copy All Colors</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicGallery;
