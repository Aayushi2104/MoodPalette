const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Get AI-powered palette suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const { mood, currentColors, userInput, style } = req.body;
    
    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY.length < 20) {
      console.log('Google AI API key not configured, using fallback palette generation');
      const fallbackColors = generateFallbackPalette(req.body.mood);
      return res.json({
        suggestions: fallbackColors,
        explanation: generateExplanation(mood, style, userInput) + " (Generated using color theory algorithms)",
        confidence: 0.8,
        fallback: true
      });
    }
    
    // Construct prompt for Gemini
    const prompt = buildAIPrompt(mood, currentColors, userInput, style);
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // Parse the AI response to extract colors
    const colors = parseColorsFromResponse(aiText);
    
    res.json({
      suggestions: colors,
      explanation: generateExplanation(mood, style, userInput),
      confidence: calculateConfidence(colors)
    });
    
  } catch (error) {
    console.error('Google AI API Error:', error.message);
    
    // Determine error type for better user feedback
    const isAuthError = error.message?.includes('API_KEY') || error.message?.includes('authentication');
    
    // Fallback to algorithmic suggestions if AI fails
    const fallbackColors = generateFallbackPalette(req.body.mood);
    res.json({
      suggestions: fallbackColors,
      explanation: isAuthError 
        ? generateExplanation(req.body.mood, req.body.style, req.body.userInput) + " (AI temporarily unavailable - using color theory algorithms)"
        : "AI temporarily unavailable. Here's an algorithmic suggestion based on color theory.",
      confidence: 0.7,
      fallback: true
    });
  }
};

// Generate contextual AI prompt
function buildAIPrompt(mood, currentColors, userInput, style) {
  let prompt = `You are a professional color theory expert and designer. Generate exactly 5 hex color codes for a "${mood}" mood palette`;
  
  if (currentColors && currentColors.length > 0) {
    prompt += `. Current colors: ${currentColors.join(', ')}. Suggest complementary colors`;
  }
  
  if (userInput) {
    prompt += `. User wants: ${userInput}`;
  }
  
  if (style) {
    prompt += `. Style: ${style}`;
  }
  
  prompt += '. Respond with ONLY 5 hex color codes separated by commas (e.g., #FF5733, #33FF57, #3357FF, #F7DC6F, #BB8FCE). No other text or explanation.';
  return prompt;
}

// Parse colors from AI response
function parseColorsFromResponse(text) {
  const hexPattern = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
  const matches = text.match(hexPattern) || [];
  
  // Ensure we have 5 colors, fill with defaults if needed
  const colors = matches.slice(0, 5);
  while (colors.length < 5) {
    colors.push('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
  }
  
  return colors;
}

// Generate explanation for the palette
function generateExplanation(mood, style, userInput) {
  let explanation = "";
  
  // Base explanation by mood
  const moodExplanations = {
    calm: "These soothing blues and greens promote tranquility and peace",
    energetic: "Vibrant and warm colors to boost energy and motivation",
    romantic: "Soft pinks and warm tones create an intimate atmosphere",
    professional: "Sophisticated neutrals with accent colors for credibility",
    creative: "Bold and inspiring colors to stimulate imagination",
    focused: "Balanced colors that enhance concentration and clarity"
  };
  
  explanation = moodExplanations[mood] || "A harmonious palette based on color theory principles";
  
  // Add style context if specified
  if (style) {
    const styleAdditions = {
      minimalist: " with clean, understated tones",
      vibrant: " featuring bold, saturated hues",
      pastel: " using soft, muted variations",
      earth: " incorporating natural, grounded colors",
      monochromatic: " exploring variations of a single hue",
      complementary: " using opposing colors for dynamic contrast"
    };
    explanation += styleAdditions[style] || ` with a ${style} aesthetic`;
  }
  
  // Add user input context if provided
  if (userInput && userInput.trim()) {
    explanation += `. Tailored for: ${userInput.trim()}`;
  }
  
  return explanation;
}

// Calculate confidence score based on color harmony
function calculateConfidence(colors) {
  // Simple heuristic - you could make this more sophisticated
  return Math.random() * 0.3 + 0.7; // 0.7 to 1.0
}

// Fallback palette generation
function generateFallbackPalette(mood) {
  const palettes = {
    calm: ['#A3CEF1', '#5390D9', '#6930C3', '#80FFDB', '#B8C0FF'],
    romantic: ['#FFB3C6', '#FF8FAB', '#FDC5F5', '#F7A072', '#F67280'],
    energetic: ['#FFD60A', '#FF6F00', '#FF206E', '#41EAD4', '#FBFF12'],
    professional: ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#ECF0F1']
  };
  
  return palettes[mood] || palettes.calm;
}

// Generate AI-powered animation CSS
exports.getAnimationCSS = async (req, res) => {
  try {
    const { description, colors } = req.body;
    
    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY.length < 20) {
      console.log('Google AI API key not configured, using fallback animation');
      const fallbackCSS = generateFallbackAnimation(description, colors);
      return res.json({
        css: fallbackCSS,
        explanation: `Animation based on "${description}" - Generated using fallback algorithms`,
        fallback: true
      });
    }
    
    // Construct prompt for Gemini
    const prompt = buildAnimationPrompt(description, colors);
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // Clean and format the CSS response
    const cleanCSS = cleanAnimationCSS(aiText);
    
    res.json({
      css: cleanCSS,
      explanation: `Custom animation based on: "${description}"`,
      fallback: false
    });
    
  } catch (error) {
    console.error('Google AI Animation API Error:', error.message);
    
    // Fallback to algorithmic animation generation
    const fallbackCSS = generateFallbackAnimation(req.body.description, req.body.colors);
    res.json({
      css: fallbackCSS,
      explanation: `AI temporarily unavailable. Generated fallback animation for: "${req.body.description}"`,
      fallback: true
    });
  }
};

// Build animation prompt for AI
function buildAnimationPrompt(description, colors) {
  const colorList = colors && colors.length > 0 ? colors.join(', ') : '#FFB6C1, #87CEFA, #98FB98, #FFD700';
  
  return `You are a CSS animation expert. Generate a complete CSS animation based on this description: "${description}"

Use these colors: ${colorList}

Requirements:
1. Generate ONLY valid CSS code with keyframes and classes
2. Use the class name ".ai-generated-animation" for the main animation
3. Include all necessary @keyframes rules
4. Make it smooth and visually appealing
5. Ensure cross-browser compatibility
6. Use the provided colors creatively in the animation
7. Make the animation loop infinitely
8. Include any necessary transform, opacity, or other properties

Example structure:
.ai-generated-animation {
  /* main styles */
  animation: yourAnimationName 4s ease-in-out infinite;
}

@keyframes yourAnimationName {
  0% { /* start state */ }
  50% { /* middle state */ }
  100% { /* end state */ }
}

Generate the CSS now:`;
}

// Clean and format AI-generated CSS
function cleanAnimationCSS(aiText) {
  // Remove any non-CSS text and clean up the response
  let css = aiText;
  
  // Remove markdown code blocks if present
  css = css.replace(/```css/g, '').replace(/```/g, '');
  
  // Remove any explanatory text before the CSS
  const cssStart = css.indexOf('.ai-generated-animation') || css.indexOf('@keyframes') || css.indexOf('.') || 0;
  if (cssStart > 0) {
    css = css.substring(cssStart);
  }
  
  // Basic validation - ensure it contains CSS-like content
  if (!css.includes('{') || !css.includes('}')) {
    throw new Error('Invalid CSS generated');
  }
  
  return css.trim();
}

// Generate fallback animation when AI is unavailable
function generateFallbackAnimation(description, colors) {
  const colorList = colors && colors.length > 0 ? colors : ['#FFB6C1', '#87CEFA', '#98FB98', '#FFD700'];
  
  // Simple keyword-based animation generation
  const keywords = description.toLowerCase();
  
  if (keywords.includes('pulse') || keywords.includes('heartbeat') || keywords.includes('throb')) {
    return `
.ai-generated-animation {
  background: linear-gradient(45deg, ${colorList.join(', ')});
  animation: pulseBeat 2s ease-in-out infinite;
}

@keyframes pulseBeat {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}`;
  }
  
  if (keywords.includes('rotate') || keywords.includes('spin') || keywords.includes('swirl')) {
    return `
.ai-generated-animation {
  background: conic-gradient(${colorList.join(', ')});
  animation: spinSwirl 4s linear infinite;
}

@keyframes spinSwirl {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
  }
  
  if (keywords.includes('wave') || keywords.includes('ocean') || keywords.includes('flow')) {
    return `
.ai-generated-animation {
  background: linear-gradient(45deg, ${colorList.join(', ')});
  background-size: 400% 400%;
  animation: waveFlow 6s ease-in-out infinite;
}

@keyframes waveFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
  }
  
  if (keywords.includes('bounce') || keywords.includes('jump') || keywords.includes('hop')) {
    return `
.ai-generated-animation {
  background: radial-gradient(circle, ${colorList.join(', ')});
  animation: bounceMotion 1.5s ease-in-out infinite;
}

@keyframes bounceMotion {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-20px); }
  50% { transform: translateY(-10px); }
  75% { transform: translateY(-15px); }
}`;
  }
  
  // Default animation
  return `
.ai-generated-animation {
  background: linear-gradient(45deg, ${colorList.join(', ')});
  background-size: 200% 200%;
  animation: defaultMotion 4s ease-in-out infinite;
}

@keyframes defaultMotion {
  0% { background-position: 0% 0%; transform: scale(1); }
  50% { background-position: 100% 100%; transform: scale(1.05); }
  100% { background-position: 0% 0%; transform: scale(1); }
}`;
}