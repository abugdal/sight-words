
import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';

// Game Modes
import FlashCardGame from './components/GameModes/FlashCardGame';
import HearingGame from './components/GameModes/HearingGame';
import SpellingGame from './components/GameModes/SpellingGame';

// Shared Components
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import ParentZone from './components/ParentZone';

import { defaultDictionaryId } from './data/dictionaries';
import {
  getActiveWordPool,
  getRandomWordV2,
  updateWordStats
} from './data/logicV2';

function App() {
  // --- STATE ---
  /* 
    State has expanded for Phase 2:
    currentGameMode: 'flashcard' | 'hearing' | 'spelling'
    previewDuration: number (logic handled in SpellingGame)
  */

  const [word, setWord] = useState("Ready?");
  const [activeDictionaries, setActiveDictionaries] = useState([defaultDictionaryId]);
  const [wordStats, setWordStats] = useState({});
  const [globalStats, setGlobalStats] = useState({ score: 0, streak: 0 });

  // Settings
  const [mode, setMode] = useState("Current Targets"); // Word Difficulty
  const [gameMode, setGameMode] = useState("flashcard");
  const [previewDuration, setPreviewDuration] = useState(3000);
  const [showParentZone, setShowParentZone] = useState(false);

  // Derived State (Word Pool)
  const wordPool = useMemo(() => getActiveWordPool(activeDictionaries), [activeDictionaries]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('nora_v2_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.activeDictionaries) setActiveDictionaries(data.activeDictionaries);
      if (data.wordStats) setWordStats(data.wordStats);
      if (data.globalStats) setGlobalStats(data.globalStats);
      // Load Phase 2 settings if present
      if (data.gameMode) setGameMode(data.gameMode);
      if (data.previewDuration) setPreviewDuration(data.previewDuration);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    const dataToSave = {
      activeDictionaries,
      wordStats,
      globalStats,
      gameMode,
      previewDuration
    };
    localStorage.setItem('nora_v2_data', JSON.stringify(dataToSave));
  }, [activeDictionaries, wordStats, globalStats, gameMode, previewDuration]);

  // Initial Word
  useEffect(() => {
    if (word === "Ready?" || word === "Done!") {
      if (wordPool.length > 0) {
        setWord(getRandomWordV2(mode, wordPool, wordStats));
      }
    }
  }, [wordPool, mode]);

  const triggerConfetti = () => {
    const duration = 1000;
    const end = Date.now() + duration;
    // ... same confetti logic ...
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#60A5FA', '#34D399', '#F472B6'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#60A5FA', '#34D399', '#F472B6'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleCorrect = () => {
    setGlobalStats(prev => ({
      score: prev.score + 10,
      streak: prev.streak + 1
    }));
    triggerConfetti();

    const newStats = updateWordStats(word, true, wordStats);
    setWordStats(prev => ({ ...prev, [word]: newStats }));
    setWord(getRandomWordV2(mode, wordPool, { ...wordStats, [word]: newStats }));
  };

  const handleIncorrect = () => {
    setGlobalStats(prev => ({ ...prev, streak: 0 }));

    // In Spelling Mode, maybe we don't punish immediately? 
    // For now, consistent logic across all modes.
    const newStats = updateWordStats(word, false, wordStats);
    setWordStats(prev => ({ ...prev, [word]: newStats }));
    setWord(getRandomWordV2(mode, wordPool, { ...wordStats, [word]: newStats }));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress?")) {
      setWordStats({});
      setGlobalStats({ score: 0, streak: 0 });
      localStorage.clear();
      window.location.reload(); // Cleanest way to reset everything for now
    }
  };

  const toggleDictionary = (id) => {
    setActiveDictionaries(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter(d => d !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between pb-safe select-none overflow-hidden touch-none">
      <header className="w-full bg-white shadow-sm py-4 mb-4 px-4 flex justify-between items-center relative gap-4">
        <div className="w-10"></div>
        <h1 className="text-xl sm:text-3xl font-bold text-slate-700 text-center flex-grow truncate">
          ⭐ Nora's Sight Words ⭐
        </h1>
        <button
          onClick={() => setShowParentZone(true)}
          className="text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Settings"
        >
          ⚙️
        </button>
      </header>

      {/* Game Content Area */}
      {gameMode === 'flashcard' && <FlashCardGame word={word} />}
      {gameMode === 'hearing' && <HearingGame word={word} />}
      {gameMode === 'spelling' && (
        <SpellingGame
          word={word}
        // In future we might let SpellingGame handle correctness itself,
        // but for now relying on the main controls for consistency?
        // Actually, spelling usually validates itself. 
        // BUT Controls are shared. 
        // Let's keep shared controls for simple valid/invalid marking by parent/child
        // even if visual feedback says "Correct".
        />
      )}

      {/* Shared Stats */}
      <div className="absolute top-20 left-4 z-0 opacity-20 pointer-events-none scale-75 origin-top-left hidden sm:block">
        {/* Could put stats floating here for desktop, but mobile is priority. 
             ScoreBoard is inside App layout usually. 
         */}
      </div>

      {/* We need ScoreBoard visible always */}
      <div className="w-full max-w-4xl px-4">
        <ScoreBoard score={globalStats.score} streak={globalStats.streak} />
      </div>

      <Controls onCorrect={handleCorrect} onIncorrect={handleIncorrect} />

      <ParentZone
        isOpen={showParentZone}
        onClose={() => setShowParentZone(false)}
        currentMode={mode}
        onModeChange={setMode}
        currentGameMode={gameMode}
        onGameModeChange={setGameMode}
        previewDuration={previewDuration}
        onPreviewDurationChange={setPreviewDuration}
        stats={{ wordStats, globalStats }}
        activeDictionaries={activeDictionaries}
        onDictionaryToggle={toggleDictionary}
        resetProgress={handleReset}
      />
    </div>
  );
}

export default App;
