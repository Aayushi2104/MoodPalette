import React, { useState } from 'react';
import AISuggestions from './AISuggestions';
import SoothingColorAnimation from './SoothingAnimation';
import { API_ENDPOINTS } from '../config/api';

const MOODS = [
	{ label: 'Random', value: 'random' },
	{ label: 'Calm', value: 'calm' },
	{ label: 'Romantic', value: 'romantic' },
	{ label: 'Energetic', value: 'energetic' },
	{ label: 'Country: India', value: 'india' },
	{ label: 'Country: Japan', value: 'japan' },
	{ label: 'Country: France', value: 'france' },
];

function getRandomColor() {
	return '#' + Math.floor(Math.random() * 16777215)
		.toString(16)
		.padStart(6, '0');
}

function generatePalette(mood) {
	// Simple logic for demo; expand for real moods/countries
	if (mood === 'calm')
		return [
			'#A3CEF1',
			'#5390D9',
			'#6930C3',
			'#80FFDB',
			'#B8C0FF',
		];
	if (mood === 'romantic')
		return [
			'#FFB3C6',
			'#FF8FAB',
			'#FDC5F5',
			'#F7A072',
			'#F67280',
		];
	if (mood === 'energetic')
		return [
			'#FFD60A',
			'#FF6F00',
			'#FF206E',
			'#41EAD4',
			'#FBFF12',
		];
	if (mood === 'india')
		return [
			'#FF9933',
			'#FFFFFF',
			'#138808',
			'#000080',
			'#FFC300',
		];
	if (mood === 'japan')
		return [
			'#E60026',
			'#FFFFFF',
			'#B5B5B5',
			'#F7E1D7',
			'#A5A5A5',
		];
	if (mood === 'france')
		return [
			'#0055A4',
			'#FFFFFF',
			'#EF4135',
			'#FFD700',
			'#002654',
		];
	// Default random
	return Array(5)
		.fill()
		.map(getRandomColor);
}

const PaletteGenerator = () => {
	const [mood, setMood] = useState('random');
	const [palette, setPalette] = useState(generatePalette('random'));
	const [locked, setLocked] = useState([false, false, false, false, false]);
	const [publicPalettes, setPublicPalettes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [saveLoading, setSaveLoading] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(null);
	const [isPublic, setIsPublic] = useState(false);

	const regenerate = () => {
		const newColors = generatePalette(mood);
		setPalette(
			palette.map((color, i) => (locked[i] ? color : newColors[i])),
		);
		setSaveSuccess(null); // Clear save success message
	};

	const toggleLock = (idx) => {
		setLocked(
			locked.map((l, i) => (i === idx ? !l : l)),
		);
	};

	const handleMoodChange = (e) => {
		setMood(e.target.value);
		setPalette(generatePalette(e.target.value));
		setLocked([false, false, false, false, false]);
		setSaveSuccess(null);
	};

	const fetchPublicPalettes = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(API_ENDPOINTS.PALETTE.PUBLIC);
			if (!res.ok) throw new Error('Failed to fetch palettes');
			const data = await res.json();
			setPublicPalettes(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const savePalette = async () => {
		setSaveLoading(true);
		setSaveSuccess(null);
		setError(null);
		try {
			// TODO: Replace with real userId from auth context
			const userId = 'demo-user';
			const res = await fetch(API_ENDPOINTS.PALETTE.SAVE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId,
					colors: palette,
					mood,
					country: ['india', 'japan', 'france'].includes(mood)
						? mood
						: undefined,
					isPublic,
				}),
			});
			if (!res.ok) throw new Error('Failed to save palette');
			setSaveSuccess('Palette saved successfully! 🎉');
			setTimeout(() => setSaveSuccess(null), 3000); // Clear after 3 seconds
		} catch (err) {
			setError(err.message);
		} finally {
			setSaveLoading(false);
		}
	};

	const copyToClipboard = (colors) => {
		const colorString = colors.join(', ');
		navigator.clipboard.writeText(colorString);
		alert('Colors copied to clipboard!');
	};

	const handleAISuggestion = (suggestedColors) => {
		setPalette(suggestedColors);
		setLocked([false, false, false, false, false]); // Unlock all colors for new AI suggestion
		setSaveSuccess(null);
	};

	return (
		<div className="min-h-screen py-8 px-6">
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="text-center mb-12 animate-fade-in">
					<h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
						<span className="bg-gradient-to-r from-mood-cyan via-mood-purple to-mood-pink bg-clip-text text-transparent">
							Palette Generator
						</span>
					</h2>
					<p className="text-xl text-black/80 dark:text-white/80 max-w-2xl mx-auto">
						Create beautiful color palettes based on your mood or inspiration
					</p>
					<div className="flex justify-center items-center space-x-2 mt-4 text-black/60 dark:text-white/60">
						<span className="w-2 h-2 bg-mood-cyan rounded-full animate-pulse"></span>
						<span className="text-sm">AI-Enhanced Color Creation</span>
						<span className="w-2 h-2 bg-mood-pink rounded-full animate-pulse"></span>
					</div>
				</div>

				{/* Mood Selector */}
				<div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 animate-slide-up card-hover">
					<div className="flex items-center mb-6">
						<span className="text-2xl mr-3">🎭</span>
						<h3 className="text-xl font-semibold text-black dark:text-white">
							Choose Your Mood or Theme
						</h3>
					</div>
					<select
						value={mood}
						onChange={handleMoodChange}
						className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:ring-2 focus:ring-mood-purple focus:border-transparent transition-all duration-300 text-lg"
					>
						{MOODS.map((m) => (
							<option
								key={m.value}
								value={m.value}
								className="bg-gray-800 text-white"
							>
								{m.label}
							</option>
						))}
					</select>
				</div>

				{/* AI Suggestions Section */}
				<div className="animate-slide-up">
					<AISuggestions
						currentMood={mood}
						currentPalette={palette}
						onApplySuggestion={handleAISuggestion}
					/>
				</div>

				{/* Main Palette Display */}
				<div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 animate-slide-up card-hover">
					<div className="flex items-center mb-8">
						<span className="text-2xl mr-3">🎨</span>
						<h3 className="text-xl font-semibold text-black dark:text-white">
							Your Color Palette
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
						{palette.map((color, i) => (
							<div key={i} className="group">
								<div
									className="w-full h-40 md:h-48 rounded-xl shadow-lg cursor-pointer transition-all duration-300 relative overflow-hidden group-hover:scale-105 group-hover:shadow-2xl"
									style={{
										background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
										border: locked[i]
											? '3px solid #fff'
											: '2px solid rgba(255,255,255,0.2)',
									}}
									onClick={() => copyToClipboard([color])}
								>
									{/* Hover overlay */}
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
										<span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											Click to copy
										</span>
									</div>

									{/* Lock indicator */}
									{locked[i] && (
										<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
											<span className="text-gray-800 text-sm">🔒</span>
										</div>
									)}

									{/* Sparkle effect */}
									<div className="absolute top-2 left-2 w-2 h-2 bg-white/60 rounded-full animate-sparkle"></div>
								</div>

								<div className="mt-4 text-center">
									<button
										onClick={() => toggleLock(i)}
										className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 mb-3 ${
											locked[i]
												? 'bg-white/20 text-black dark:text-white border-2 border-white/30 shadow-inner-glow'
												: 'bg-white/10 text-black/80 dark:text-white/80 hover:bg-white/20 hover:text-black dark:hover:text-white border-2 border-white/10'
										}`}
									>
										{locked[i] ? '🔒 Locked' : '🔓 Unlocked'}
									</button>
									<div className="text-sm font-mono text-black/80 dark:text-white/80 bg-black/20 rounded-lg px-3 py-1 backdrop-blur-sm">
										{color}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
						<button
							onClick={regenerate}
							className="group px-8 py-4 bg-gradient-to-r from-mood-purple to-mood-indigo text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-glow hover:shadow-glow-blue flex items-center space-x-3"
						>
							<span className="text-xl group-hover:animate-bounce-gentle">
								🎲
							</span>
							<span>Regenerate Palette</span>
						</button>

						<button
							onClick={() => copyToClipboard(palette)}
							className="group px-8 py-4 bg-gradient-to-r from-mood-cyan to-mood-blue text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-glow-blue flex items-center space-x-3"
						>
							<span className="text-xl group-hover:animate-bounce-gentle">
								📋
							</span>
							<span>Copy All Colors</span>
						</button>

						<button
							onClick={fetchPublicPalettes}
							className="group px-8 py-4 bg-gradient-to-r from-mood-pink to-mood-rose text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-glow-pink flex items-center space-x-3"
						>
							<span className="text-xl group-hover:animate-bounce-gentle">
								🖼️
							</span>
							<span>Browse Gallery</span>
						</button>
					</div>
				</div>

				{/* Soothing Animation Section */}
				<div className="animate-slide-up">
					<SoothingColorAnimation palette={palette} />
				</div>

				{/* Save Palette Section */}
				<div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 animate-slide-up card-hover">
					<div className="flex items-center mb-6">
						<span className="text-2xl mr-3">💾</span>
						<h3 className="text-xl font-semibold text-black dark:text-white">
							Save Your Palette
						</h3>
					</div>

					<div className="flex flex-col sm:flex-row gap-6 items-center">
						<label className="flex items-center text-black/90 dark:text-white/90 cursor-pointer group">
							<input
								type="checkbox"
								checked={isPublic}
								onChange={(e) => setIsPublic(e.target.checked)}
								className="mr-3 w-5 h-5 text-mood-purple bg-white/10 border-white/20 rounded focus:ring-mood-purple focus:ring-2"
							/>
							<span className="group-hover:text-black dark:group-hover:text-white transition-colors">
								Make this palette public (others can see it in the gallery)
							</span>
						</label>

						<button
							onClick={savePalette}
							disabled={saveLoading}
							className="group px-8 py-4 bg-gradient-to-r from-mood-emerald to-mood-cyan text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
						>
							<span className="text-xl group-hover:animate-bounce-gentle">
								{saveLoading ? '⏳' : '💾'}
							</span>
							<span>{saveLoading ? 'Saving...' : 'Save Palette'}</span>
						</button>
					</div>

					{saveSuccess && (
						<div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-xl text-emerald-100 text-center animate-fade-in backdrop-blur-sm">
							<span className="text-lg">✨ {saveSuccess}</span>
						</div>
					)}
				</div>

				{/* Error Display */}
				{error && (
					<div className="glass-effect backdrop-blur-lg border border-red-400/30 rounded-xl p-6 mb-8 animate-fade-in">
						<div className="flex items-center text-red-200">
							<span className="text-2xl mr-3">⚠️</span>
							<p className="text-lg">{error}</p>
						</div>
					</div>
				)}

				{/* Loading State */}
				{loading && (
					<div className="text-center py-8 animate-fade-in">
						<div className="inline-flex items-center space-x-3 text-black/80 dark:text-white/80">
							<div className="w-6 h-6 border-2 border-black/30 dark:border-white/30 border-t-black dark:border-t-white rounded-full animate-spin"></div>
							<span className="text-lg">Loading beautiful palettes...</span>
						</div>
					</div>
				)}

				{/* Public Palettes Grid */}
				{publicPalettes.length > 0 && (
					<div className="glass-effect backdrop-blur-lg rounded-2xl border border-white/20 p-8 animate-slide-up">
						<div className="flex items-center mb-8">
							<span className="text-2xl mr-3">🌍</span>
							<h3 className="text-xl font-semibold text-black dark:text-white">
								Community Palettes
							</h3>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{publicPalettes.map((p, idx) => (
								<div
									key={p._id || idx}
									className="glass-effect backdrop-blur-sm border border-white/10 rounded-xl p-6 card-hover group"
								>
									<div className="flex gap-1 mb-4 rounded-lg overflow-hidden">
										{p.colors.map((color, i) => (
											<div
												key={i}
												className="flex-1 h-16 cursor-pointer transition-all duration-300 hover:scale-105"
												style={{ backgroundColor: color }}
												title={color}
												onClick={() => copyToClipboard([color])}
											/>
										))}
									</div>

									<div className="flex justify-between items-center">
										<div>
											<span className="text-black dark:text-white font-medium capitalize flex items-center space-x-2">
												<span>{p.mood}</span>
												{p.country && (
													<span className="text-black/60 dark:text-white/60">
														({p.country})
													</span>
												)}
											</span>
											<p className="text-black/50 dark:text-white/50 text-sm mt-1">
												{new Date(p.createdAt).toLocaleDateString()}
											</p>
										</div>

										<button
											onClick={() => copyToClipboard(p.colors)}
											className="px-4 py-2 bg-white/10 text-black dark:text-white text-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 group-hover:border-white/40"
										>
											Copy
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PaletteGenerator;
