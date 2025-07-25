import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ANIMATION_TYPES = [
  { label: 'Gradient Wave', value: 'gradient' },
  { label: 'Color Bubbles', value: 'bubbles' },
  { label: 'Flowing Orbs', value: 'orbs' },
  { label: 'Gentle Pulse', value: 'pulse' },
  { label: 'Cursor Ripple', value: 'ripple' }
];

const SoothingAnimation = ({ colors = ['#FFB6C1', '#87CEFA', '#98FB98', '#FFD700'], animationType = 'gradient' }) => {
  const gradient = colors.join(', ');
  const [ripples, setRipples] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const rippleIdRef = useRef(0);
  
  // Handle mouse movement for cursor tracking
  const handleMouseMove = (e) => {
    if (containerRef.current && animationType === 'ripple') {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    }
  };

  // Handle click to create ripples
  const handleClick = (e) => {
    if (containerRef.current && animationType === 'ripple') {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Create a new ripple
      const newRipple = {
        id: rippleIdRef.current++,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        timestamp: Date.now()
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 2000);
    }
  };

  // Auto-generate ripples near cursor when hovering
  useEffect(() => {
    if (animationType === 'ripple' && isHovering) {
      const interval = setInterval(() => {
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        const newRipple = {
          id: rippleIdRef.current++,
          x: Math.max(5, Math.min(95, mousePos.x + offsetX)),
          y: Math.max(5, Math.min(95, mousePos.y + offsetY)),
          color: colors[Math.floor(Math.random() * colors.length)],
          timestamp: Date.now(),
          auto: true
        };
        
        setRipples(prev => [...prev, newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1500);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [animationType, isHovering, mousePos, colors]);
  
  const renderAnimation = () => {
    switch (animationType) {
      case 'gradient':
        return (
          <div
            className="w-full h-64 animate-bgFade rounded-xl shadow-lg"
            style={{
              background: `linear-gradient(-45deg, ${gradient})`,
              backgroundSize: '400% 400%',
            }}
          />
        );
        
      case 'bubbles':
        return (
          <div className="w-full h-64 rounded-xl shadow-lg relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`absolute rounded-full animate-float-${index % 4} opacity-70`}
                style={{
                  backgroundColor: color,
                  width: `${80 + index * 20}px`,
                  height: `${80 + index * 20}px`,
                  left: `${index * 20 + 10}%`,
                  top: `${index * 15 + 10}%`,
                  animationDelay: `${index * 2}s`,
                  animationDuration: `${8 + index * 2}s`
                }}
              />
            ))}
          </div>
        );
        
      case 'orbs':
        return (
          <div className="w-full h-64 rounded-xl shadow-lg relative overflow-hidden bg-black">
            {colors.map((color, index) => (
              <div
                key={index}
                className="absolute rounded-full animate-drift blur-sm opacity-60"
                style={{
                  backgroundColor: color,
                  width: `${100 + index * 30}px`,
                  height: `${100 + index * 30}px`,
                  left: `${index * 25}%`,
                  top: `${index * 20}%`,
                  animationDelay: `${index * 3}s`,
                  animationDuration: `${12 + index * 3}s`
                }}
              />
            ))}
          </div>
        );
        
      case 'pulse':
        return (
          <div className="w-full h-64 rounded-xl shadow-lg relative overflow-hidden">
            {colors.map((color, index) => (
              <div
                key={index}
                className="absolute inset-0 animate-pulse-wave opacity-30"
                style={{
                  backgroundColor: color,
                  animationDelay: `${index * 1.5}s`,
                  animationDuration: `${6 + index}s`
                }}
              />
            ))}
          </div>
        );
        
      case 'ripple':
        return (
          <div 
            ref={containerRef}
            className="w-full h-64 rounded-xl shadow-lg relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-800 cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleClick}
          >
            {/* Enhanced animated background gradient using palette colors */}
            <div 
              className="absolute inset-0 opacity-50 transition-all duration-700 ease-out"
              style={{
                background: `
                  radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${colors[0]}40, ${colors[1]}20, transparent 70%), 
                  radial-gradient(circle at ${(mousePos.x + 40) % 100}% ${(mousePos.y + 30) % 100}%, ${colors[2]}30, transparent 60%),
                  radial-gradient(circle at ${(mousePos.x + 70) % 100}% ${(mousePos.y + 60) % 100}%, ${colors[3] || colors[0]}25, transparent 50%),
                  linear-gradient(45deg, ${colors[0]}05, ${colors[1]}05, ${colors[2]}05)
                `,
              }}
            />
            
            {/* Enhanced cursor follower with multiple layers */}
            {isHovering && (
              <div
                className="absolute pointer-events-none transition-all duration-300 ease-out"
                style={{
                  left: `${mousePos.x}%`,
                  top: `${mousePos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Outer glow ring */}
                <div 
                  className="absolute w-16 h-16 rounded-full border animate-pulse-glow"
                  style={{
                    borderColor: `${colors[0]}40`,
                    borderWidth: '1px',
                    boxShadow: `0 0 30px ${colors[0]}40, inset 0 0 20px ${colors[0]}10`,
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                  }}
                />
                
                {/* Middle ring with rotation */}
                <div 
                  className="absolute w-10 h-10 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: colors[1],
                    borderTopColor: 'transparent',
                    borderRightColor: 'transparent',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                    animationDuration: '3s',
                  }}
                />
                
                {/* Inner core with pulsing glow */}
                <div 
                  className="absolute w-6 h-6 rounded-full animate-pulse"
                  style={{
                    backgroundColor: colors[2],
                    boxShadow: `0 0 20px ${colors[2]}80, 0 0 40px ${colors[2]}40, inset 0 0 10px ${colors[2]}60`,
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                  }}
                />
                
                {/* Orbiting particles */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-spin"
                    style={{
                      backgroundColor: colors[i % colors.length],
                      boxShadow: `0 0 8px ${colors[i % colors.length]}60`,
                      left: '50%',
                      top: '50%',
                      transformOrigin: `${15 + i * 5}px 0`,
                      transform: 'translate(-50%, -50%)',
                      animationDuration: `${2 + i * 0.5}s`,
                      animationDelay: `${i * 0.3}s`,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Enhanced user-generated ripples with gradient effects */}
            {ripples.map((ripple) => (
              <div
                key={ripple.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${ripple.x}%`,
                  top: `${ripple.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Multiple expanding rings with gradient colors */}
                {[0, 1, 2, 3, 4].map((ringIndex) => (
                  <div
                    key={ringIndex}
                    className="absolute rounded-full animate-ripple-expand"
                    style={{
                      background: `conic-gradient(from ${ringIndex * 72}deg, ${ripple.color}60, ${colors[(ringIndex + 1) % colors.length]}40, ${ripple.color}60)`,
                      borderRadius: '50%',
                      width: '8px',
                      height: '8px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${ringIndex * 0.15}s`,
                      animationDuration: `${ripple.auto ? 2 : 2.5}s`,
                      opacity: ripple.auto ? 0.5 : 0.8,
                      filter: 'blur(0.5px)',
                    }}
                  />
                ))}
                
                {/* Secondary ring wave */}
                {[0, 1, 2].map((waveIndex) => (
                  <div
                    key={`wave-${waveIndex}`}
                    className="absolute rounded-full border-2 animate-ripple-expand"
                    style={{
                      borderColor: `${colors[waveIndex % colors.length]}50`,
                      width: '12px',
                      height: '12px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${waveIndex * 0.25 + 0.1}s`,
                      animationDuration: `${ripple.auto ? 1.8 : 2.2}s`,
                      opacity: ripple.auto ? 0.3 : 0.6,
                    }}
                  />
                ))}
                
                {/* Enhanced central glowing core */}
                <div
                  className="absolute rounded-full animate-pulse-glow"
                  style={{
                    background: `radial-gradient(circle, ${ripple.color}ff, ${ripple.color}80, transparent)`,
                    boxShadow: `
                      0 0 20px ${ripple.color}80, 
                      0 0 40px ${ripple.color}50, 
                      0 0 60px ${ripple.color}30,
                      inset 0 0 15px ${ripple.color}40
                    `,
                    width: ripple.auto ? '8px' : '14px',
                    height: ripple.auto ? '8px' : '14px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    animationDuration: ripple.auto ? '1.2s' : '2s',
                  }}
                />
                
                {/* Particle explosion effect */}
                {!ripple.auto && [...Array(6)].map((_, particleIndex) => (
                  <div
                    key={`particle-${particleIndex}`}
                    className="absolute rounded-full animate-particle-burst"
                    style={{
                      backgroundColor: colors[particleIndex % colors.length],
                      boxShadow: `0 0 6px ${colors[particleIndex % colors.length]}60`,
                      width: '3px',
                      height: '3px',
                      left: '50%',
                      top: '50%',
                      transform: `
                        translate(-50%, -50%) 
                        rotate(${particleIndex * 60}deg) 
                        translateX(${20 + particleIndex * 5}px)
                      `,
                      transformOrigin: 'center',
                      animationDelay: `${particleIndex * 0.1}s`,
                      animationDuration: '1.5s',
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            ))}
            
            {/* Enhanced ambient floating particles with trails */}
            {colors.map((color, index) => (
              <div key={`ambient-${index}`}>
                {/* Main floating particle */}
                <div
                  className="absolute rounded-full opacity-40 animate-float-trail"
                  style={{
                    background: `radial-gradient(circle, ${color}ff, ${color}60, transparent)`,
                    boxShadow: `0 0 12px ${color}50, 0 0 24px ${color}20`,
                    width: `${6 + Math.sin(index * 2) * 3}px`,
                    height: `${6 + Math.sin(index * 2) * 3}px`,
                    left: `${(index * 25 + 10) % 90}%`,
                    top: `${(index * 20 + 15) % 80}%`,
                    animationDelay: `${index * 1.5}s`,
                    animationDuration: `${15 + index * 2}s`,
                  }}
                />
                
                {/* Particle trail effect */}
                {[...Array(3)].map((_, trailIndex) => (
                  <div
                    key={`trail-${index}-${trailIndex}`}
                    className="absolute rounded-full opacity-20 animate-drift-slow"
                    style={{
                      backgroundColor: color,
                      width: `${2 + trailIndex}px`,
                      height: `${2 + trailIndex}px`,
                      left: `${(index * 25 + 10 - trailIndex * 2) % 90}%`,
                      top: `${(index * 20 + 15 - trailIndex) % 80}%`,
                      animationDelay: `${index * 1.5 + trailIndex * 0.2}s`,
                      animationDuration: `${15 + index * 2}s`,
                      filter: 'blur(0.5px)',
                    }}
                  />
                ))}
                
                {/* Micro sparkle particles */}
                {[...Array(2)].map((_, microIndex) => (
                  <div
                    key={`micro-${index}-${microIndex}`}
                    className="absolute rounded-full opacity-30 animate-twinkle"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 4px ${color}80`,
                      width: '1.5px',
                      height: '1.5px',
                      left: `${(index * 30 + microIndex * 15 + 5) % 95}%`,
                      top: `${(index * 25 + microIndex * 20 + 10) % 90}%`,
                      animationDelay: `${index * 2 + microIndex}s`,
                      animationDuration: `${3 + index}s`,
                    }}
                  />
                ))}
              </div>
            ))}
            
            {/* Enhanced instructions overlay with better styling */}
            <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-white/80 text-xs space-y-1">
                <p className="flex items-center gap-2">
                  <span className="text-yellow-400">✨</span>
                  <span>Move cursor for ambient magic</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-400">💫</span>
                  <span>Click for burst effects</span>
                </p>
              </div>
            </div>
            
            {/* Corner accent particles */}
            {[0, 1, 2, 3].map((corner) => (
              <div
                key={`corner-${corner}`}
                className="absolute w-1 h-1 rounded-full animate-twinkle"
                style={{
                  backgroundColor: colors[corner % colors.length],
                  boxShadow: `0 0 8px ${colors[corner % colors.length]}60`,
                  left: corner % 2 === 0 ? '5%' : '95%',
                  top: corner < 2 ? '10%' : '90%',
                  animationDelay: `${corner * 0.5}s`,
                  animationDuration: '4s',
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        );
        
      default:
        return (
          <div
            className="w-full h-64 animate-bgFade rounded-xl shadow-lg"
            style={{
              background: `linear-gradient(-45deg, ${gradient})`,
              backgroundSize: '400% 400%',
            }}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {renderAnimation()}
    </div>
  );
};

SoothingAnimation.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  animationType: PropTypes.string,
};

const SoothingColorAnimation = ({ palette }) => {
  const [animationType, setAnimationType] = useState('gradient');
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnimation, setAiAnimation] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [showAiSection, setShowAiSection] = useState(false);

  // Handler to copy CSS to clipboard
  const handleCopyCSS = () => {
    const css = getSoothingBackgroundCSS(palette, animationType);
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Handler to generate AI animation
  const handleGenerateAIAnimation = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please describe the animation you want to create');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('http://localhost:5000/ai/animation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: aiPrompt.trim(),
          colors: palette
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate animation');
      }

      const data = await response.json();
      setAiAnimation({
        css: data.css,
        explanation: data.explanation,
        fallback: data.fallback,
        description: aiPrompt.trim()
      });
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Handler to copy AI-generated CSS
  const handleCopyAICSS = () => {
    if (aiAnimation?.css) {
      navigator.clipboard.writeText(aiAnimation.css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // Handler to apply AI animation as preview
  const handleApplyAIAnimation = () => {
    if (aiAnimation?.css) {
      // Inject the CSS into the document
      const styleId = 'ai-animation-preview';
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = aiAnimation.css;
      setAnimationType('ai-generated');
    }
  };

  return (
    <div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 card-hover">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-black flex items-center gap-3">
          <span className="text-2xl animate-bounce-gentle">🌊</span>
          <span className="bg-gradient-to-r from-mood-cyan to-mood-purple bg-clip-text text-transparent">
            Soothing Animation Preview
          </span>
        </h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`group px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            isPlaying 
              ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30' 
              : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-400/30'
          }`}
        >
          <span className="text-lg group-hover:animate-bounce-gentle">
            {isPlaying ? '⏸️' : '▶️'}
          </span>
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>
      
      {/* Animation Style Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-black mb-3 flex items-center space-x-2">
          <span>🎭</span>
          <span>Animation Style</span>
        </label>
        <select 
          value={animationType} 
          onChange={(e) => setAnimationType(e.target.value)} 
          className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-black focus:ring-2 focus:ring-mood-purple focus:border-transparent transition-all duration-300"
        >
          {ANIMATION_TYPES.map(type => (
            <option key={type.value} value={type.value} className="bg-gray-800 text-white">
              {type.label}
            </option>
          ))}
          {aiAnimation && (
            <option value="ai-generated" className="bg-purple-800 text-white">
              🤖 AI Generated: {aiAnimation.description}
            </option>
          )}
        </select>
      </div>

      {/* AI Animation Generator Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-black flex items-center space-x-2">
            <span>🤖</span>
            <span>Create Custom Animation with AI</span>
          </label>
          <button
            onClick={() => setShowAiSection(!showAiSection)}
            className="px-3 py-1 text-xs bg-white/10 text-black/80 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            {showAiSection ? '🔽 Hide' : '▶️ Show'}
          </button>
        </div>

        {showAiSection && (
          <div className="glass-effect backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4 animate-slide-up">
            <div>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your animation idea (e.g., 'floating hearts with sparkles', 'swirling galaxy effect', 'gentle rainfall')"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-black placeholder-black/50 focus:ring-2 focus:ring-mood-purple focus:border-transparent transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateAIAnimation()}
              />
            </div>

            <button
              onClick={handleGenerateAIAnimation}
              disabled={aiLoading || !aiPrompt.trim()}
              className="group w-full px-6 py-3 bg-gradient-to-r from-mood-purple via-mood-indigo to-mood-blue text-white font-semibold rounded-xl shadow-glow hover:shadow-glow-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center justify-center space-x-3"
            >
              {aiLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Animation...</span>
                </>
              ) : (
                <>
                  <span className="text-xl group-hover:animate-bounce-gentle">🎨</span>
                  <span>Generate AI Animation</span>
                  <span className="text-xl group-hover:animate-bounce-gentle">✨</span>
                </>
              )}
            </button>

            {/* AI Error Display */}
            {aiError && (
              <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm backdrop-blur-sm animate-fade-in">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⚠️</span>
                  <span>{aiError}</span>
                </div>
              </div>
            )}

            {/* AI Animation Result */}
            {aiAnimation && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-start space-x-3 mb-3">
                    <span className="text-lg">✨</span>
                    <div>
                      <p className="text-green-200 dark:text-green-200 text-sm font-medium">Animation Generated!</p>
                      <p className="text-green-200/80 dark:text-green-200/80 text-xs">{aiAnimation.explanation}</p>
                      {aiAnimation.fallback && (
                        <p className="text-yellow-200/80 dark:text-yellow-200/80 text-xs mt-1">⚠️ Using fallback algorithm (AI temporarily unavailable)</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleApplyAIAnimation}
                    className="group flex-1 px-4 py-3 bg-gradient-to-r from-mood-emerald to-mood-cyan text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-glow flex items-center justify-center space-x-2"
                  >
                    <span className="text-lg group-hover:animate-bounce-gentle">🎬</span>
                    <span>Preview Animation</span>
                  </button>
                  <button
                    onClick={handleCopyAICSS}
                    className="px-4 py-3 bg-white/10 text-black dark:text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center space-x-2"
                  >
                    <span>📋</span>
                    <span>Copy CSS</span>
                  </button>
                </div>
              </div>
            )}

            {/* AI Tips */}
            <div className="text-xs text-black/60 dark:text-white/60 space-y-1">
              <p><strong className="text-black/90 dark:text-white/90">💡 Tips for better AI animations:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Be descriptive: &ldquo;floating bubbles&rdquo; vs &ldquo;bubbles that slowly rise and pop&rdquo;</li>
                <li>• Mention motion: &ldquo;spinning&rdquo;, &ldquo;pulsing&rdquo;, &ldquo;flowing&rdquo;, &ldquo;bouncing&rdquo;</li>
                <li>• Add emotions: &ldquo;peaceful waves&rdquo;, &ldquo;energetic sparks&rdquo;, &ldquo;dreamy clouds&rdquo;</li>
                <li>• Specify effects: &ldquo;with glow&rdquo;, &ldquo;with trails&rdquo;, &ldquo;with sparkles&rdquo;</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Animation Preview Container - Fixed height to prevent shrinking */}
      <div className={`relative overflow-hidden rounded-2xl border-2 border-white/20 transition-all duration-300 ${isPlaying ? 'shadow-glow' : 'opacity-50 grayscale'}`} style={{ minHeight: '256px', height: '256px' }}>
        {animationType === 'ai-generated' && aiAnimation ? (
          <div 
            className="ai-generated-animation w-full h-full rounded-xl"
            style={{ 
              background: aiAnimation.fallback ? 
                `linear-gradient(45deg, ${palette.join(', ')})` : 
                undefined 
            }}
          />
        ) : (
          <div className="w-full h-full">
            <SoothingAnimation colors={palette} animationType={animationType} />
          </div>
        )}
        
        {/* Overlay when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <div className="text-white/80 text-center">
              <div className="text-4xl mb-2">⏸️</div>
              <p className="text-sm">Animation Paused</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-black/70 dark:text-white/70 text-sm leading-relaxed">
          Experience how your color palette feels in motion. Perfect for relaxation and mood visualization.
          <br />
          <span className="text-black/50 dark:text-white/50">Choose different animation styles or create custom ones with AI to see how your colors flow and interact.</span>
        </p>
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={handleCopyCSS}
            className="px-5 py-2 rounded-xl bg-mood-purple/80 text-white font-semibold shadow hover:bg-mood-purple/90 transition-all duration-300 border border-mood-purple/40"
          >
            {copied ? '✅ CSS Copied!' : 'Copy CSS for this Animation'}
          </button>
          {aiAnimation && animationType === 'ai-generated' && (
            <button
              onClick={handleCopyAICSS}
              className="px-5 py-2 rounded-xl bg-mood-cyan/80 text-white font-semibold shadow hover:bg-mood-cyan/90 transition-all duration-300 border border-mood-cyan/40"
            >
              {copied ? '✅ AI CSS Copied!' : 'Copy AI Animation CSS'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

SoothingColorAnimation.propTypes = {
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const getSoothingBackgroundCSS = (colors, animationType) => {
  if (!colors || colors.length === 0) colors = ['#FFB6C1', '#87CEFA', '#98FB98', '#FFD700'];
  switch (animationType) {
    case 'gradient':
      return `
        /* Soothing Gradient Wave Background */
        .soothing-bg {
          background: linear-gradient(-45deg, ${colors.join(', ')});
          background-size: 400% 400%;
          animation: bgFade 12s ease-in-out infinite;
        }
        @keyframes bgFade {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
    case 'bubbles':
      return `
        /* Soothing Color Bubbles Background (requires HTML structure for bubbles) */
        .soothing-bg {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${colors[0]}, ${colors[1]});
        }
        .soothing-bg .bubble {
          position: absolute;
          border-radius: 50%;
          opacity: 0.7;
          animation: float 10s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-40px); }
          100% { transform: translateY(0); }
        }
      `;
    case 'orbs':
      return `
        /* Soothing Flowing Orbs Background (requires HTML structure for orbs) */
        .soothing-bg {
          position: relative;
          overflow: hidden;
          background: #000;
        }
        .soothing-bg .orb {
          position: absolute;
          border-radius: 50%;
          opacity: 0.6;
          filter: blur(4px);
          animation: drift 16s linear infinite;
        }
        @keyframes drift {
          0% { transform: translateY(0); }
          50% { transform: translateY(30px) scale(1.1); }
          100% { transform: translateY(0); }
        }
      `;
    case 'pulse':
      return `
        /* Soothing Gentle Pulse Background (requires HTML structure for pulses) */
        .soothing-bg {
          position: relative;
          overflow: hidden;
        }
        .soothing-bg .pulse {
          position: absolute;
          inset: 0;
          opacity: 0.3;
          animation: pulseWave 8s ease-in-out infinite;
        }
        @keyframes pulseWave {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `;
    case 'ripple':
      return `
        /* Soothing Cursor Ripple Background (requires JS for interaction) */
        .soothing-bg {
          background: linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]});
        }
        /* Ripple effect requires additional JS/HTML structure */
      `;
    default:
      return '';
  }
}

export default SoothingColorAnimation;