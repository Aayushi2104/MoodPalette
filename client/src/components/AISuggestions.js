import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { API_ENDPOINTS } from '../config/api';

const AISuggestions = ({ currentMood, currentPalette, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [style, setStyle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const STYLE_OPTIONS = [
    { label: 'Any Style', value: '' },
    { label: 'Minimalist', value: 'minimalist' },
    { label: 'Vibrant', value: 'vibrant' },
    { label: 'Pastel', value: 'pastel' },
    { label: 'Earth Tones', value: 'earth' },
    { label: 'Monochromatic', value: 'monochromatic' },
    { label: 'Complementary', value: 'complementary' }
  ];

  // Auto-fetch suggestions when mood changes
  useEffect(() => {
    if (currentMood && currentMood !== 'random') {
      fetchSuggestions();
    }
  }, [currentMood]);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.AI.SUGGESTIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: currentMood,
          currentColors: currentPalette,
          userInput: userInput.trim(),
          style: style
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      setExplanation(data.explanation);
      setConfidence(data.confidence);
      
      if (data.fallback) {
        setError('AI temporarily unavailable - showing algorithmic suggestions');
      }
    } catch (error) {
      console.error('AI suggestions error:', error);
      setError(error.message);
      
      // Fallback to simple algorithmic suggestions
      generateFallbackSuggestions();
    } finally {
      setLoading(false);
    }
  };

  // Fallback function to generate algorithmic suggestions
  const generateFallbackSuggestions = () => {
    // Simple fallback algorithm for color suggestions
    const fallbackColors = [];
    const baseColors = currentPalette && currentPalette.length > 0 ? currentPalette : ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
    
    // Generate variations based on current palette or default colors
    for (let i = 0; i < 5; i++) {
      const baseColor = baseColors[i % baseColors.length];
      // Simple color manipulation for variety
      fallbackColors.push(baseColor);
    }
    
    setSuggestions(fallbackColors);
    setExplanation('Generated using fallback algorithm while AI is unavailable.');
    setConfidence(0.6);
  };

  const handleGetSuggestions = () => {
    fetchSuggestions();
  };

  const handleApplySuggestion = (colors) => {
    onApplySuggestion(colors);
    setExpanded(false);
  };

  const copyToClipboard = (colors) => {
    const colorString = colors.join(', ');
    navigator.clipboard.writeText(colorString);
    alert('AI suggestion copied to clipboard!');
  };

  return (
    <div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 card-hover">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-black dark:text-white flex items-center gap-3">
          <span className="text-2xl animate-bounce-gentle">🤖</span>
          <span className="bg-gradient-to-r from-mood-cyan to-mood-purple bg-clip-text text-transparent">
            AI Color Suggestions
          </span>
          {confidence > 0 && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              confidence > 0.8 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
              confidence > 0.6 ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
              'bg-red-500/20 text-red-300 border border-red-400/30'
            }`}>
              {Math.round(confidence * 100)}% confidence
            </span>
          )}
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 text-sm bg-white/10 text-black/80 dark:text-white/80 rounded-xl hover:bg-white/20 hover:text-black dark:hover:text-white transition-all duration-300 border border-white/20 flex items-center space-x-2"
        >
          <span>{expanded ? '🔽' : '▶️'}</span>
          <span>{expanded ? 'Collapse' : 'Expand'}</span>
        </button>
      </div>

      {expanded && (
        <div className="space-y-6 animate-slide-up">
          {/* User Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black/90 dark:text-white/90 mb-3 flex items-center space-x-2">
                <span>💭</span>
                <span>Describe what you want (optional)</span>
              </label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., sunset colors, ocean vibes, warm and cozy"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:ring-2 focus:ring-mood-purple focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/90 dark:text-white/90 mb-3 flex items-center space-x-2">
                <span>🎨</span>
                <span>Style Preference</span>
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-black dark:text-white focus:ring-2 focus:ring-mood-purple focus:border-transparent transition-all duration-300"
              >
                {STYLE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Get Suggestions Button */}
          <button
            onClick={handleGetSuggestions}
            disabled={loading || !currentMood}
            className="group w-full px-6 py-4 bg-gradient-to-r from-mood-purple via-mood-indigo to-mood-blue text-white font-semibold text-lg rounded-xl shadow-glow hover:shadow-glow-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Getting AI suggestions...</span>
              </>
            ) : (
              <>
                <span className="text-xl group-hover:animate-bounce-gentle">🧠</span>
                <span>Get AI Suggestions</span>
                <span className="text-xl group-hover:animate-bounce-gentle">✨</span>
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl text-amber-200 text-sm backdrop-blur-sm animate-fade-in">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* AI Explanation */}
          {explanation && (
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl backdrop-blur-sm animate-fade-in">
              <div className="flex items-start space-x-3">
                <span className="text-lg">💡</span>
                <p className="text-blue-200 text-sm leading-relaxed">{explanation}</p>
              </div>
            </div>
          )}

          {/* Suggestions Display */}
          {suggestions.length > 0 && (
            <div className="space-y-4 animate-slide-up">
              <h4 className="font-semibold text-black dark:text-white flex items-center space-x-2">
                <span className="text-xl">🎨</span>
                <span>AI Suggested Palette:</span>
              </h4>
              <div className="glass-effect backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:shadow-glow transition-all duration-300">
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {suggestions.map((color, i) => (
                    <div
                      key={i}
                      className="group relative"
                    >
                      <div
                        className="w-full h-20 rounded-lg cursor-pointer relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                          border: '2px solid rgba(255,255,255,0.2)'
                        }}
                        title={color}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {color}
                          </span>
                        </div>
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/60 rounded-full animate-sparkle"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApplySuggestion(suggestions)}
                    className="group flex-1 px-4 py-3 bg-gradient-to-r from-mood-purple to-mood-indigo text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-glow flex items-center justify-center space-x-2"
                  >
                    <span className="text-lg group-hover:animate-bounce-gentle">✨</span>
                    <span>Apply This Palette</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(suggestions)}
                    className="px-4 py-3 bg-white/10 text-black dark:text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center space-x-2"
                  >
                    <span>📋</span>
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="glass-effect backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-sm text-black/70 dark:text-white/70 space-y-2">
              <p className="flex items-center space-x-2">
                <span>💡</span>
                <strong className="text-black/90 dark:text-white/90">Tips for better AI suggestions:</strong>
              </p>
              <ul className="ml-6 space-y-1 text-black/60 dark:text-white/60">
                <li>• Be specific in your description for better results</li>
                <li>• Try different style preferences to explore variations</li>
                <li>• The AI considers your current mood and existing colors</li>
                <li>• Experiment with different combinations!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed View */}
      {!expanded && suggestions.length > 0 && (
        <div className="grid grid-cols-5 gap-2 animate-fade-in">
          {suggestions.map((color, i) => (
            <div
              key={i}
              className="w-full h-12 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: color }}
              title={`AI suggestion: ${color}`}
              onClick={() => setExpanded(true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

AISuggestions.propTypes = {
  currentMood: PropTypes.string,
  currentPalette: PropTypes.arrayOf(PropTypes.string),
  onApplySuggestion: PropTypes.func.isRequired,
};

export default AISuggestions;