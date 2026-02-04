import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Timer, Award } from 'lucide-react';
import { GOLD, TECHNIQUE_ICONS } from '../../data/constants';
import { Card, Button } from '../ui';

const TrainingMode = ({ cocktails }) => {
  const [mode, setMode] = useState('menu'); // menu, learn, quiz, mix, speed, results, mixResults
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [quizCocktails, setQuizCocktails] = useState([]);

  // Mixology Challenge State
  const [mixCocktail, setMixCocktail] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedGlass, setSelectedGlass] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState('');
  const [mixScore, setMixScore] = useState(null);
  const [mixRound, setMixRound] = useState(1);
  const [mixTotalScore, setMixTotalScore] = useState(0);
  const [mixHistory, setMixHistory] = useState([]);

  // Animation States
  const [isPouring, setIsPouring] = useState(false);
  const [liquidLevel, setLiquidLevel] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isStirring, setIsStirring] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [glassColor, setGlassColor] = useState('#D4AF37');
  const [lastAddedIngredient, setLastAddedIngredient] = useState(null);
  const [showSplash, setShowSplash] = useState(false);

  // Speed Challenge State
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedRound, setSpeedRound] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [speedHistory, setSpeedHistory] = useState([]);

  // Ice animation
  const [iceDropping, setIceDropping] = useState(false);
  const [iceCubes, setIceCubes] = useState([]);

  // Ingredient colors for liquid effect
  const ingredientColors = {
    'vodka': '#f5f5f5', 'gin': '#e8f4f8', 'rum': '#f5deb3', 'white rum': '#f5f5f5',
    'tequila': '#f5f5dc', 'whiskey': '#d4a574', 'bourbon': '#c68642', 'cognac': '#8b4513',
    'lime': '#90EE90', 'lemon': '#FFFF99', 'orange': '#FFA500', 'grapefruit': '#FF6B6B',
    'cranberry': '#DC143C', 'pineapple': '#FFD700', 'grenadine': '#FF1744',
    'blue curacao': '#00BFFF', 'coffee': '#4a2c2a', 'cream': '#FFFDD0',
    'mint': '#98FB98', 'campari': '#FF4136', 'aperol': '#FF6B35',
    'default': '#D4AF37'
  };

  // Get liquid color based on ingredients
  const getLiquidColor = (ingredients) => {
    if (ingredients.length === 0) return '#D4AF37';
    const colors = ingredients.map(ing => {
      const key = Object.keys(ingredientColors).find(k => ing.toLowerCase().includes(k));
      return ingredientColors[key] || ingredientColors.default;
    });
    return colors[colors.length - 1]; // Use last added color as dominant
  };

  // Timer effect for speed mode
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      calculateMixScore();
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, timeLeft]);

  // Get all unique ingredients, glasses, and techniques from cocktails
  const allIngredients = useMemo(() => {
    const ingredients = new Set();
    cocktails.forEach(c => c.ingredients.forEach(i => ingredients.add(i)));
    return [...ingredients].sort();
  }, [cocktails]);

  // Categorize ingredients for better UI
  const categorizedIngredients = useMemo(() => {
    const categories = {
      'Spirits': [],
      'Liqueurs': [],
      'Citrus': [],
      'Mixers': [],
      'Syrups': [],
      'Other': []
    };

    allIngredients.forEach(ing => {
      const lower = ing.toLowerCase();
      if (lower.includes('vodka') || lower.includes('gin') || lower.includes('rum') ||
          lower.includes('tequila') || lower.includes('whiskey') || lower.includes('bourbon') ||
          lower.includes('cognac') || lower.includes('mezcal') || lower.includes('scotch')) {
        categories['Spirits'].push(ing);
      } else if (lower.includes('liqueur') || lower.includes('triple sec') || lower.includes('cointreau') ||
                 lower.includes('campari') || lower.includes('aperol') || lower.includes('vermouth') ||
                 lower.includes('kahlua') || lower.includes('amaretto') || lower.includes('chartreuse')) {
        categories['Liqueurs'].push(ing);
      } else if (lower.includes('lime') || lower.includes('lemon') || lower.includes('orange') ||
                 lower.includes('grapefruit') || lower.includes('citrus')) {
        categories['Citrus'].push(ing);
      } else if (lower.includes('juice') || lower.includes('soda') || lower.includes('tonic') ||
                 lower.includes('water') || lower.includes('cola') || lower.includes('ginger')) {
        categories['Mixers'].push(ing);
      } else if (lower.includes('syrup') || lower.includes('sugar') || lower.includes('honey') ||
                 lower.includes('agave') || lower.includes('grenadine')) {
        categories['Syrups'].push(ing);
      } else {
        categories['Other'].push(ing);
      }
    });

    return categories;
  }, [allIngredients]);

  const allGlasses = useMemo(() => {
    const glasses = new Set();
    cocktails.forEach(c => { if (c.glass) glasses.add(c.glass); });
    return [...glasses].sort();
  }, [cocktails]);

  const allTechniques = ['Shake', 'Stir', 'Build', 'Muddle', 'Blend', 'Layer'];

  const startQuiz = () => {
    const shuffled = [...cocktails].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizCocktails(shuffled);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setShowAnswer(false);
    setMode('quiz');
  };

  const startMixChallenge = (isSpeed = false) => {
    const randomCocktail = cocktails[Math.floor(Math.random() * cocktails.length)];
    setMixCocktail(randomCocktail);
    setSelectedIngredients([]);
    setSelectedGlass('');
    setSelectedTechnique('');
    setMixScore(null);
    setMixRound(1);
    setMixTotalScore(0);
    setMixHistory([]);
    setLiquidLevel(0);
    setGlassColor('#D4AF37');
    setIceCubes([]);

    if (isSpeed) {
      setTimeLeft(30);
      setSpeedScore(0);
      setSpeedRound(1);
      setSpeedHistory([]);
      setIsTimerRunning(true);
      setMode('speed');
    } else {
      setMode('mix');
    }
  };

  const nextMixRound = () => {
    const randomCocktail = cocktails[Math.floor(Math.random() * cocktails.length)];
    setMixCocktail(randomCocktail);
    setSelectedIngredients([]);
    setSelectedGlass('');
    setSelectedTechnique('');
    setMixScore(null);
    setMixRound(prev => prev + 1);
    setLiquidLevel(0);
    setGlassColor('#D4AF37');
    setIceCubes([]);

    if (mode === 'speed') {
      setTimeLeft(30);
      setSpeedRound(prev => prev + 1);
      setIsTimerRunning(true);
    }
  };

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
      setLiquidLevel(prev => Math.max(0, prev - 12));
    } else {
      // Pour animation
      setLastAddedIngredient(ingredient);
      setIsPouring(true);
      setShowSplash(true);

      setTimeout(() => {
        setSelectedIngredients(prev => [...prev, ingredient]);
        setLiquidLevel(prev => Math.min(85, prev + 12));
        setGlassColor(getLiquidColor([...selectedIngredients, ingredient]));
        setIsPouring(false);
      }, 400);

      setTimeout(() => setShowSplash(false), 600);
    }
  };

  const addIce = () => {
    setIceDropping(true);
    const newCube = { id: Date.now(), x: 30 + Math.random() * 40 };
    setIceCubes(prev => [...prev, newCube]);
    setTimeout(() => setIceDropping(false), 500);
  };

  const selectTechnique = (technique) => {
    setSelectedTechnique(technique);

    if (technique === 'Shake') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 800);
    } else if (technique === 'Stir') {
      setIsStirring(true);
      setTimeout(() => setIsStirring(false), 1000);
    }
  };

  const calculateMixScore = () => {
    if (!mixCocktail) return;

    const correctIngredients = mixCocktail.ingredients;
    const correctSet = new Set(correctIngredients);

    let ingredientPoints = 0;
    let maxIngredientPoints = correctIngredients.length * 10;

    const correctlySelected = selectedIngredients.filter(i => correctSet.has(i));
    ingredientPoints += correctlySelected.length * 10;

    const wrongIngredients = selectedIngredients.filter(i => !correctSet.has(i));
    ingredientPoints -= wrongIngredients.length * 3;

    if (correctlySelected.length === correctIngredients.length && wrongIngredients.length === 0) {
      ingredientPoints += 15;
    }

    const glassCorrect = selectedGlass && mixCocktail.glass &&
      mixCocktail.glass.toLowerCase().includes(selectedGlass.toLowerCase().split(' ')[0]);
    const glassPoints = glassCorrect ? 15 : 0;

    const techniqueCorrect = selectedTechnique && mixCocktail.technique &&
      mixCocktail.technique.toLowerCase() === selectedTechnique.toLowerCase();
    const techniquePoints = techniqueCorrect ? 15 : 0;

    // Speed bonus
    const speedBonus = mode === 'speed' && timeLeft > 0 ? Math.floor(timeLeft / 2) : 0;

    const earnedPoints = Math.max(0, ingredientPoints) + glassPoints + techniquePoints + speedBonus;
    const maxPoints = maxIngredientPoints + 15 + 30 + (mode === 'speed' ? 15 : 0);
    const percentage = Math.round((earnedPoints / maxPoints) * 100);

    const roundScore = {
      cocktail: mixCocktail.name,
      ingredientsCorrect: correctlySelected.length,
      ingredientsTotal: correctIngredients.length,
      wrongIngredients: wrongIngredients.length,
      glassCorrect,
      techniqueCorrect,
      percentage,
      earnedPoints,
      maxPoints,
      timeLeft: mode === 'speed' ? timeLeft : null,
      speedBonus
    };

    setMixScore(roundScore);
    setMixTotalScore(prev => prev + percentage);
    setMixHistory(prev => [...prev, roundScore]);

    if (mode === 'speed') {
      setSpeedScore(prev => prev + percentage);
      setSpeedHistory(prev => [...prev, roundScore]);
      setIsTimerRunning(false);
    }

    // Confetti for great scores
    if (percentage >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const handleAnswer = (correct) => {
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    if (currentIndex < quizCocktails.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setMode('results');
    }
  };

  const currentCocktail = mode === 'quiz' ? quizCocktails[currentIndex] : cocktails[currentIndex];

  const getScoreColor = (pct) => {
    if (pct >= 80) return '#10B981';
    if (pct >= 60) return GOLD;
    if (pct >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreEmoji = (pct) => {
    if (pct >= 90) return '🏆';
    if (pct >= 80) return '🌟';
    if (pct >= 60) return '👍';
    if (pct >= 40) return '🤔';
    return '💪';
  };

  // Animation styles
  const animationStyles = `
    @keyframes pour {
      0% { transform: translateY(-100%) scaleY(0); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translateY(0) scaleY(1); opacity: 1; }
    }
    @keyframes splash {
      0% { transform: scale(0); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.5; }
      100% { transform: scale(2); opacity: 0; }
    }
    @keyframes shake {
      0%, 100% { transform: rotate(0deg) translateX(0); }
      10% { transform: rotate(-10deg) translateX(-5px); }
      20% { transform: rotate(10deg) translateX(5px); }
      30% { transform: rotate(-10deg) translateX(-5px); }
      40% { transform: rotate(10deg) translateX(5px); }
      50% { transform: rotate(-8deg) translateX(-3px); }
      60% { transform: rotate(8deg) translateX(3px); }
      70% { transform: rotate(-5deg) translateX(-2px); }
      80% { transform: rotate(5deg) translateX(2px); }
      90% { transform: rotate(-2deg) translateX(-1px); }
    }
    @keyframes stir {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes liquidWave {
      0%, 100% { transform: translateX(-2px) skewX(-1deg); }
      50% { transform: translateX(2px) skewX(1deg); }
    }
    @keyframes iceDrop {
      0% { transform: translateY(-50px); opacity: 0; }
      60% { transform: translateY(10px); opacity: 1; }
      80% { transform: translateY(-5px); }
      100% { transform: translateY(0); }
    }
    @keyframes confetti {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
      50% { transform: scale(1.02); box-shadow: 0 0 20px 5px rgba(212, 175, 55, 0.2); }
    }
    @keyframes glow {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.3); }
    }
    @keyframes bubbles {
      0% { transform: translateY(0) scale(1); opacity: 0.6; }
      100% { transform: translateY(-30px) scale(0); opacity: 0; }
    }
    @keyframes scoreReveal {
      0% { transform: scale(0) rotate(-180deg); opacity: 0; }
      50% { transform: scale(1.2) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes slideIn {
      0% { transform: translateX(-20px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes timerPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;

  // Confetti component
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            backgroundColor: ['#D4AF37', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4'][Math.floor(Math.random() * 5)],
            animation: `confetti ${1.5 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
    </div>
  );

  // Cocktail Glass Visual Component
  const CocktailGlass = () => (
    <div
      className="relative mx-auto"
      style={{
        width: '160px',
        height: '200px',
        animation: isShaking ? 'shake 0.8s ease-in-out' : undefined
      }}
    >
      {/* Pour stream */}
      {isPouring && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-3 rounded-full"
          style={{
            top: '-60px',
            height: '80px',
            backgroundColor: glassColor,
            animation: 'pour 0.4s ease-out',
            opacity: 0.8
          }}
        />
      )}

      {/* Splash effect */}
      {showSplash && (
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: `${85 - liquidLevel}%`,
            width: '40px',
            height: '40px',
            backgroundColor: glassColor,
            animation: 'splash 0.6s ease-out',
            opacity: 0.5
          }}
        />
      )}

      {/* Glass outline */}
      <svg viewBox="0 0 100 130" className="w-full h-full">
        {/* Glass body */}
        <path
          d="M15 10 L20 100 Q20 115 35 120 L65 120 Q80 115 80 100 L85 10 Z"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />

        {/* Liquid */}
        <clipPath id="glassClip">
          <path d="M17 12 L22 98 Q22 112 35 117 L65 117 Q78 112 78 98 L83 12 Z" />
        </clipPath>

        <g clipPath="url(#glassClip)">
          {/* Liquid fill */}
          <rect
            x="15"
            y={115 - liquidLevel}
            width="70"
            height={liquidLevel + 5}
            fill={glassColor}
            style={{
              animation: liquidLevel > 0 ? 'liquidWave 2s ease-in-out infinite' : undefined,
              transition: 'y 0.3s ease-out, fill 0.3s ease'
            }}
          />

          {/* Bubbles */}
          {liquidLevel > 20 && [...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={25 + i * 12}
              cy={115 - liquidLevel + 10}
              r="2"
              fill="rgba(255,255,255,0.4)"
              style={{
                animation: `bubbles ${1 + Math.random()}s ease-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}

          {/* Ice cubes (inside clip group to stay within glass) */}
          {iceCubes.map((cube, i) => (
            <g key={cube.id} style={{ animation: iceDropping && i === iceCubes.length - 1 ? 'iceDrop 0.5s ease-out' : undefined }}>
              <rect
                x={cube.x}
                y={Math.max(15, 100 - (i * 14))}
                width="15"
                height="12"
                rx="2"
                fill="rgba(200, 230, 255, 0.6)"
                stroke="rgba(255,255,255,0.4)"
              />
            </g>
          ))}
        </g>

        {/* Stir animation */}
        {isStirring && (
          <g style={{ transformOrigin: '50px 60px', animation: 'stir 1s linear infinite' }}>
            <rect x="48" y="20" width="4" height="80" rx="2" fill="rgba(150,150,150,0.8)" />
          </g>
        )}

        {/* Glass shine */}
        <path
          d="M25 15 L27 90"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* Ingredient count badge */}
      <div
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          backgroundColor: GOLD,
          color: '#000',
          animation: selectedIngredients.length > 0 ? 'pulse 2s infinite' : undefined
        }}
      >
        {selectedIngredients.length}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pb-28">
      <style>{animationStyles}</style>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      <div className="px-4 pt-4">
        <h2 className="text-2xl font-light tracking-wide" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>
          Training Center
        </h2>
      </div>

      {/* Mode Menu */}
      {mode === 'menu' && (
        <div className="px-4 space-y-3">
          <div
            onClick={() => setMode('learn')}
            className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">📚</span>
              <div>
                <h3 className="text-lg font-medium text-white">Learn Mode</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Browse recipes at your own pace</p>
              </div>
            </div>
          </div>

          <div
            onClick={startQuiz}
            className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🧠</span>
              <div>
                <h3 className="text-lg font-medium text-white">Quiz Mode</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Test your ingredient knowledge</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => startMixChallenge(false)}
            className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${GOLD}30 0%, ${GOLD}10 100%)`,
              border: `1px solid ${GOLD}50`,
              animation: 'pulse 3s infinite'
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl" style={{ animation: 'float 3s ease-in-out infinite' }}>🍸</span>
              <div>
                <h3 className="text-lg font-medium" style={{ color: GOLD }}>Mixology Challenge</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Build cocktails from memory</p>
              </div>
              <span className="ml-auto px-2 py-1 rounded text-xs" style={{ backgroundColor: `${GOLD}30`, color: GOLD }}>
                ⭐ NEW
              </span>
            </div>
          </div>

          <div
            onClick={() => startMixChallenge(true)}
            className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">⚡</span>
              <div>
                <h3 className="text-lg font-medium text-white">Speed Challenge</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>30 seconds per cocktail!</p>
              </div>
              <Timer className="ml-auto w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      )}

      {/* Back button for non-menu modes */}
      {mode !== 'menu' && (
        <div className="px-4">
          <button
            onClick={() => setMode('menu')}
            className="flex items-center gap-2 text-sm"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <ChevronLeft className="w-4 h-4" /> Back to Training Menu
          </button>
        </div>
      )}

      {/* LEARN MODE */}
      {mode === 'learn' && (
        <div className="px-4 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="p-2 rounded-lg bg-white/10" disabled={currentIndex === 0}>
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{currentIndex + 1} / {cocktails.length}</span>
              <button onClick={() => setCurrentIndex(Math.min(cocktails.length - 1, currentIndex + 1))} className="p-2 rounded-lg bg-white/10" disabled={currentIndex === cocktails.length - 1}>
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {currentCocktail && (
              <div className="text-center">
                <h3 className="text-xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{currentCocktail.name}</h3>
                <div className="space-y-2 text-left">
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <strong style={{ color: GOLD }}>Type:</strong> {currentCocktail.type}
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <strong style={{ color: GOLD }}>Glass:</strong> {currentCocktail.glass}
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <strong style={{ color: GOLD }}>Technique:</strong> {currentCocktail.technique || 'Build'}
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <strong style={{ color: GOLD }}>Ingredients:</strong> {currentCocktail.ingredients.join(', ')}
                  </p>
                  <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {currentCocktail.instructions}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* QUIZ MODE */}
      {mode === 'quiz' && quizCocktails[currentIndex] && (
        <div className="px-4 space-y-4">
          <Card className="p-4 text-center">
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Question {currentIndex + 1} of {quizCocktails.length}</p>
            <h3 className="text-xl font-light text-white mb-4">What are the ingredients in a {quizCocktails[currentIndex].name}?</h3>

            {!showAnswer ? (
              <Button variant="gold" onClick={() => setShowAnswer(true)}>Show Answer</Button>
            ) : (
              <div className="space-y-4" style={{ animation: 'slideIn 0.3s ease-out' }}>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-white">{quizCocktails[currentIndex].ingredients.join(', ')}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="danger" onClick={() => handleAnswer(false)}>Got it Wrong</Button>
                  <Button variant="success" onClick={() => handleAnswer(true)}>Got it Right</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {mode === 'results' && (
        <div className="px-4">
          <Card className="p-8 text-center">
            <Award className="w-16 h-16 mx-auto mb-4" style={{ color: GOLD, animation: 'scoreReveal 0.6s ease-out' }} />
            <h3 className="text-2xl font-light text-white mb-2">Quiz Complete!</h3>
            <p className="text-4xl font-light mb-4" style={{ color: GOLD }}>{score.correct} / {score.total}</p>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {score.correct === score.total ? 'Perfect score! 🎉' : score.correct >= score.total * 0.7 ? 'Great job! 👏' : 'Keep practicing! 💪'}
            </p>
            <Button variant="gold" onClick={startQuiz}>Try Again</Button>
          </Card>
        </div>
      )}

      {/* MIXOLOGY CHALLENGE & SPEED MODE */}
      {(mode === 'mix' || mode === 'speed') && mixCocktail && (
        <div className="px-4 space-y-4">
          {/* Timer for speed mode */}
          {mode === 'speed' && (
            <div
              className="text-center p-4 rounded-2xl"
              style={{
                backgroundColor: timeLeft <= 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${timeLeft <= 10 ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                animation: timeLeft <= 10 ? 'timerPulse 0.5s infinite' : undefined
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <Timer className={`w-6 h-6 ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`} />
                <span
                  className="text-4xl font-bold"
                  style={{ color: timeLeft <= 10 ? '#EF4444' : GOLD }}
                >
                  {timeLeft}s
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Round {speedRound} • Score: {speedScore}
              </p>
            </div>
          )}

          {/* Header */}
          <Card
            className="p-4 text-center"
            style={{ borderColor: `${GOLD}40`, animation: 'glow 2s infinite' }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {mode === 'speed' ? `Speed Round ${speedRound}` : `Round ${mixRound} of 5`}
            </p>
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Mix a <span style={{ color: GOLD }}>{mixCocktail.name}</span>
            </h3>
          </Card>

          {!mixScore ? (
            <>
              {/* Visual Glass */}
              <div className="py-4">
                <CocktailGlass />
              </div>

              {/* Ice Button */}
              <div className="flex justify-center">
                <button
                  onClick={addIce}
                  className="px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(200, 230, 255, 0.2)',
                    border: '1px solid rgba(200, 230, 255, 0.4)',
                    color: '#a5d8ff'
                  }}
                >
                  🧊 Add Ice ({iceCubes.length})
                </button>
              </div>

              {/* Ingredient Selection by Category */}
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: GOLD }}>
                  <span>🧪</span> Select Ingredients
                </h4>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {Object.entries(categorizedIngredients).map(([category, items]) =>
                    items.length > 0 && (
                      <div key={category}>
                        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {category}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {items.map(ingredient => (
                            <button
                              key={ingredient}
                              onClick={() => toggleIngredient(ingredient)}
                              disabled={isPouring}
                              className="px-3 py-1.5 rounded-full text-xs transition-all"
                              style={{
                                backgroundColor: selectedIngredients.includes(ingredient) ? `${GOLD}30` : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${selectedIngredients.includes(ingredient) ? GOLD : 'rgba(255,255,255,0.1)'}`,
                                color: selectedIngredients.includes(ingredient) ? GOLD : 'rgba(255,255,255,0.6)',
                                animation: lastAddedIngredient === ingredient && isPouring ? 'pulse 0.4s' : undefined,
                                transform: selectedIngredients.includes(ingredient) ? 'scale(1.05)' : 'scale(1)'
                              }}
                            >
                              {selectedIngredients.includes(ingredient) && '✓ '}{ingredient}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Card>

              {/* Glass Selection */}
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-3" style={{ color: GOLD }}>
                  🥃 Select Glass
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allGlasses.slice(0, 10).map(glass => (
                    <button
                      key={glass}
                      onClick={() => setSelectedGlass(glass)}
                      className="px-3 py-1.5 rounded-full text-xs transition-all"
                      style={{
                        backgroundColor: selectedGlass === glass ? `${GOLD}30` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${selectedGlass === glass ? GOLD : 'rgba(255,255,255,0.1)'}`,
                        color: selectedGlass === glass ? GOLD : 'rgba(255,255,255,0.6)',
                        transform: selectedGlass === glass ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      {glass}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Technique Selection */}
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-3" style={{ color: GOLD }}>
                  🍸 Select Technique
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {allTechniques.map(technique => (
                    <button
                      key={technique}
                      onClick={() => selectTechnique(technique)}
                      className="px-3 py-3 rounded-xl text-sm transition-all flex flex-col items-center gap-1"
                      style={{
                        backgroundColor: selectedTechnique === technique ? `${GOLD}30` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${selectedTechnique === technique ? GOLD : 'rgba(255,255,255,0.1)'}`,
                        color: selectedTechnique === technique ? GOLD : 'rgba(255,255,255,0.6)',
                        transform: selectedTechnique === technique ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      <span className="text-xl">{TECHNIQUE_ICONS[technique] || '🍹'}</span>
                      {technique}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Submit Button */}
              <Button
                variant="gold"
                className="w-full py-4 text-lg"
                onClick={calculateMixScore}
                disabled={selectedIngredients.length === 0}
                style={{ animation: selectedIngredients.length > 0 ? 'pulse 2s infinite' : undefined }}
              >
                🍸 Submit Mix
              </Button>
            </>
          ) : (
            /* Score Card */
            <Card className="p-6 text-center">
              <div
                className="text-6xl font-light mb-2"
                style={{
                  color: getScoreColor(mixScore.percentage),
                  animation: 'scoreReveal 0.6s ease-out'
                }}
              >
                {mixScore.percentage}%
              </div>
              <p className="text-3xl mb-4">{getScoreEmoji(mixScore.percentage)}</p>

              {/* Speed Bonus */}
              {mode === 'speed' && mixScore.speedBonus > 0 && (
                <div
                  className="inline-block px-4 py-2 rounded-full mb-4"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)' }}
                >
                  <span className="text-green-400 font-medium">⚡ +{mixScore.speedBonus} Speed Bonus!</span>
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-3 text-left mb-6">
                <div className="p-3 rounded-lg bg-white/5" style={{ animation: 'slideIn 0.3s ease-out' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">🧪 Ingredients</span>
                    <span style={{ color: mixScore.ingredientsCorrect === mixScore.ingredientsTotal && mixScore.wrongIngredients === 0 ? '#10B981' : GOLD }}>
                      {mixScore.ingredientsCorrect}/{mixScore.ingredientsTotal} correct
                      {mixScore.wrongIngredients > 0 && <span className="text-red-400 ml-2">({mixScore.wrongIngredients} wrong)</span>}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Correct: {mixCocktail.ingredients.join(', ')}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white/5 flex items-center justify-between" style={{ animation: 'slideIn 0.4s ease-out' }}>
                  <span className="text-sm text-white">🥃 Glass</span>
                  <span style={{ color: mixScore.glassCorrect ? '#10B981' : '#EF4444' }}>
                    {mixScore.glassCorrect ? '✓ Correct' : `✗ Was: ${mixCocktail.glass}`}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white/5 flex items-center justify-between" style={{ animation: 'slideIn 0.5s ease-out' }}>
                  <span className="text-sm text-white">🍸 Technique</span>
                  <span style={{ color: mixScore.techniqueCorrect ? '#10B981' : '#EF4444' }}>
                    {mixScore.techniqueCorrect ? '✓ Correct' : `✗ Was: ${mixCocktail.technique || 'Build'}`}
                  </span>
                </div>
              </div>

              {/* Running Total */}
              <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: `${GOLD}10`, border: `1px solid ${GOLD}30` }}>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Total Score: <span style={{ color: GOLD, fontWeight: 500 }}>{mixTotalScore} pts</span>
                  {' '}(Avg: {Math.round(mixTotalScore / mixRound)}%)
                </p>
              </div>

              {/* Action Buttons */}
              {mixRound < 5 ? (
                <Button variant="gold" className="w-full" onClick={nextMixRound}>
                  Next Cocktail →
                </Button>
              ) : (
                <Button variant="gold" className="w-full" onClick={() => setMode('mixResults')}>
                  See Final Results 🏆
                </Button>
              )}
            </Card>
          )}
        </div>
      )}

      {/* MIX CHALLENGE FINAL RESULTS */}
      {mode === 'mixResults' && (
        <div className="px-4 space-y-4">
          <Card className="p-6 text-center">
            <div className="text-5xl mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>🏆</div>
            <h3 className="text-2xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Challenge Complete!
            </h3>

            <div
              className="text-6xl font-light mb-2"
              style={{
                color: getScoreColor(Math.round(mixTotalScore / 5)),
                animation: 'scoreReveal 0.6s ease-out'
              }}
            >
              {Math.round(mixTotalScore / 5)}%
            </div>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Average Score Across 5 Cocktails
            </p>

            {/* Achievement Badge */}
            <div
              className="inline-block px-6 py-3 rounded-2xl mb-6"
              style={{
                backgroundColor: `${getScoreColor(Math.round(mixTotalScore / 5))}20`,
                border: `2px solid ${getScoreColor(Math.round(mixTotalScore / 5))}40`
              }}
            >
              <p className="text-lg font-medium" style={{ color: getScoreColor(Math.round(mixTotalScore / 5)) }}>
                {Math.round(mixTotalScore / 5) >= 90 ? '🏆 Master Mixologist' :
                 Math.round(mixTotalScore / 5) >= 80 ? '🌟 Expert Bartender' :
                 Math.round(mixTotalScore / 5) >= 60 ? '👍 Skilled Mixer' :
                 Math.round(mixTotalScore / 5) >= 40 ? '📚 Apprentice' :
                 '💪 Keep Learning'}
              </p>
            </div>

            {/* Round Breakdown */}
            <div className="space-y-2 mb-6">
              {mixHistory.map((round, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                  style={{ animation: `slideIn ${0.2 + idx * 0.1}s ease-out` }}
                >
                  <span className="text-sm text-white">{round.cocktail}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: getScoreColor(round.percentage) }}
                  >
                    {round.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="default" className="flex-1" onClick={() => setMode('menu')}>
                Back to Menu
              </Button>
              <Button variant="gold" className="flex-1" onClick={() => startMixChallenge(false)}>
                Play Again
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrainingMode;
