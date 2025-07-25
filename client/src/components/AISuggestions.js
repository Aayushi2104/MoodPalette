import React, { useState, useEffect, useCallback } from 'react';
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

  const generateFallbackSuggestions = useCallback(() => {
    const fallbackColors = [];
    const baseColors = currentPalette && currentPalette.length > 0
      ? currentPalette
      : ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];

    for (let i = 0; i < 5; i++) {
      const baseColor = baseColors[i % baseColors.length];
      fallbackColors.push(baseColor);
    }

    setSuggestions(fallbackColors);
    setExplanation('Generated using fallback algorithm while AI is unavailable.');
    setConfidence(0.6);
  }, [currentPalette]);

  useEffect(() => {
    if (currentMood && currentMood !== 'random') {
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
          if (process.env.NODE_ENV === 'development') {
            console.error('AI suggestions error (useEffect):', error);
          }
          setError(error.message);
          generateFallbackSuggestions();
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();
    }
  }, [currentMood, currentPalette, style, userInput, generateFallbackSuggestions]);

  const handleGetSuggestions = () => {
    setExpanded(true);
    setError(null);
    setLoading(true);
    setSuggestions([]);

    fetch(API_ENDPOINTS.AI.SUGGESTIONS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: currentMood,
        currentColors: currentPalette,
        userInput: userInput.trim(),
        style: style
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.suggestions);
        setExplanation(data.explanation);
        setConfidence(data.confidence);
        if (data.fallback) {
          setError('AI temporarily unavailable - showing algorithmic suggestions');
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('AI suggestions error (manual fetch):', error);
        }
        setError(error.message);
        generateFallbackSuggestions();
      })
      .finally(() => {
        setLoading(false);
      });
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">💭 Describe your idea (optional)</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., warm and cozy, ocean, sunrise"
                className="w-full p-3 bg-white/10 text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">🎨 Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-3 bg-white/10 text-white rounded-lg"
              >
                {STYLE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} className="bg-black text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGetSuggestions}
            className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition"
            disabled={loading}
          >
            {loading ? 'Loading AI Suggestions...' : '✨ Get AI Suggestions'}
          </button>

          {error && <p className="mt-4 text-red-400">{error}</p>}
          {explanation && <p className="mt-2 text-blue-300 italic">{explanation}</p>}

          {suggestions.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-5 gap-2">
                {suggestions.map((color, i) => (
                  <div
                    key={i}
                    className="w-full h-12 rounded-lg"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleApplySuggestion(suggestions)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg"
                >
                  ✅ Apply Palette
                </button>
                <button
                  onClick={() => copyToClipboard(suggestions)}
                  className="flex-1 py-2 bg-gray-700 text-white rounded-lg"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!expanded && suggestions.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {suggestions.map((color, i) => (
            <div
              key={i}
              className="w-full h-10 rounded-lg cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => setExpanded(true)}
              title="Click to expand"
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
