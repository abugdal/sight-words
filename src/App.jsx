
import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import FlashCard from './components/FlashCard';
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
    V2 State Structure:
    activeDictionaries: string[] 
    wordStats: { [word: string]: { correct: number, incorrect: number, streak: number, status: 'learning'|'mastered' } }
    globalStats: { score: number, streak: number }
  */

  const [word, setWord] = useState("Ready?");
  const [activeDictionaries, setActiveDictionaries] = useState([defaultDictionaryId]);
  const [wordStats, setWordStats] = useState({});
  const [globalStats, setGlobalStats] = useState({ score: 0, streak: 0 });

  const [mode, setMode] = useState("Current Targets");
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
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    const dataToSave = {
      activeDictionaries,
      wordStats,
      globalStats
    };
    localStorage.setItem('nora_v2_data', JSON.stringify(dataToSave));
  }, [activeDictionaries, wordStats, globalStats]);

  // Initial Word (or when pool changes if current word invalid)
  useEffect(() => {
    if (word === "Ready?" || word === "Done!") {
      if (wordPool.length > 0) {
        setWord(getRandomWordV2(mode, wordPool, wordStats));
      }
    }
  }, [wordPool, mode]); // Depend on pool and mode

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
    // 1. Update Global Stats
    setGlobalStats(prev => ({
      score: prev.score + 10,
      streak: prev.streak + 1
    }));
    triggerConfetti();

    // 2. Update Word Stats
    const newStats = updateWordStats(word, true, wordStats);
    const newWordStats = { ...wordStats, [word]: newStats };
    setWordStats(newWordStats);

    // 3. Get Next Word
    setWord(getRandomWordV2(mode, wordPool, newWordStats));
  };

  const handleIncorrect = () => {
    // 1. Update Global Stats
    setGlobalStats(prev => ({ ...prev, streak: 0 }));

    // 2. Update Word Stats
    const newStats = updateWordStats(word, false, wordStats);
    setWordStats({ ...wordStats, [word]: newStats });

    // 3. Get Next Word
    // Note: We might want to pass the OLD stats to getRandomWord if we want to retry logic?
    // But for now, just random again.
    setWord(getRandomWordV2(mode, wordPool, wordStats));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all V2 progress?")) {
      setWordStats({});
      setGlobalStats({ score: 0, streak: 0 });
      setActiveDictionaries([defaultDictionaryId]);
      localStorage.removeItem('nora_v2_data');
      setShowParentZone(false);
      setWord("Ready?");
      // Effect will pick new word
    }
  };

  const toggleDictionary = (id) => {
    setActiveDictionaries(prev => {
      if (prev.includes(id)) {
        // Prevent removing the last one?
        if (prev.length === 1) return prev;
        return prev.filter(d => d !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between pb-safe select-none">
      <header className="w-full bg-white shadow-sm py-4 mb-4 px-4 flex justify-between items-center relative gap-4">
        <div className="w-10"></div> {/* Spacer */}
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

      <div className="w-full flex-grow flex flex-col items-center justify-center max-w-4xl px-4 gap-6">
        <ScoreBoard score={globalStats.score} streak={globalStats.streak} />
        <FlashCard word={word} />
      </div>

      <Controls onCorrect={handleCorrect} onIncorrect={handleIncorrect} />

      <ParentZone
        isOpen={showParentZone}
        onClose={() => setShowParentZone(false)}
        currentMode={mode}
        onModeChange={setMode}
        stats={{ wordStats, globalStats }}
        activeDictionaries={activeDictionaries}
        onDictionaryToggle={toggleDictionary}
        resetProgress={handleReset}
      />
    </div>
  );
}

export default App;
