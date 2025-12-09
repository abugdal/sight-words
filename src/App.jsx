
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
import ProfileSelector from './components/ProfileSelector';

import { defaultDictionaryId } from './data/dictionaries';
import {
  getActiveWordPool,
  getRandomWordV2,
  updateWordStats
} from './data/logicV2';

function App() {
  // --- MULTI-USER STATE ---
  const [currentUser, setCurrentUser] = useState(null); // String name or null
  const [users, setUsers] = useState([]); // Array of strings

  // --- GAME STATE (Per User) ---
  const [word, setWord] = useState("Ready?");
  const [activeDictionaries, setActiveDictionaries] = useState([defaultDictionaryId]);
  const [wordStats, setWordStats] = useState({});
  const [globalStats, setGlobalStats] = useState({ score: 0, streak: 0 });
  const [mode, setMode] = useState("Current Targets");
  const [gameMode, setGameMode] = useState("flashcard");
  const [previewDuration, setPreviewDuration] = useState(3000);

  const [showParentZone, setShowParentZone] = useState(false);

  // Derived State
  const wordPool = useMemo(() => getActiveWordPool(activeDictionaries), [activeDictionaries]);

  // 1. INITIALIZATION & MIGRATION
  useEffect(() => {
    // Check for existing users config
    const savedUsers = localStorage.getItem('sight_words_users');

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // MIGRATION: Check for legacy data
      const legacyData = localStorage.getItem('nora_v2_data');
      if (legacyData) {
        console.log("Migrating legacy data to user: Nora");
        localStorage.setItem('sight_words_data_Nora', legacyData);
        localStorage.setItem('sight_words_users', JSON.stringify(['Nora']));
        localStorage.removeItem('nora_v2_data'); // Cleanup
        setUsers(['Nora']);
      } else {
        // New Install? No users yet.
        setUsers([]);
      }
    }
  }, []);

  // 2. LOAD USER DATA
  useEffect(() => {
    if (!currentUser) return;

    const key = `sight_words_data_${currentUser}`;
    const savedData = localStorage.getItem(key);

    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.activeDictionaries) setActiveDictionaries(data.activeDictionaries);
      if (data.wordStats) setWordStats(data.wordStats);
      if (data.globalStats) setGlobalStats(data.globalStats);
      if (data.gameMode) setGameMode(data.gameMode);
      if (data.previewDuration) setPreviewDuration(data.previewDuration);
      // Reset word to force refresh
      setWord("Ready?");
    } else {
      // Defaults for new user
      setActiveDictionaries([defaultDictionaryId]);
      setWordStats({});
      setGlobalStats({ score: 0, streak: 0 });
      setGameMode("flashcard");
      setWord("Ready?");
    }
  }, [currentUser]);

  // 3. SAVE USER DATA
  useEffect(() => {
    if (!currentUser) return;

    const dataToSave = {
      activeDictionaries,
      wordStats,
      globalStats,
      gameMode,
      previewDuration
    };
    const key = `sight_words_data_${currentUser}`;
    localStorage.setItem(key, JSON.stringify(dataToSave));
  }, [currentUser, activeDictionaries, wordStats, globalStats, gameMode, previewDuration]);

  // Initial Word (Unchanged logic, just depends on loaded state)
  useEffect(() => {
    if ((word === "Ready?" || word === "Done!") && currentUser) {
      if (wordPool.length > 0) {
        setWord(getRandomWordV2(mode, wordPool, wordStats));
      }
    }
  }, [wordPool, mode, currentUser, wordStats]); // Added currentUser dep

  // --- ACTIONS ---

  const handleCreateUser = (name) => {
    const newUsers = [...users, name];
    setUsers(newUsers);
    localStorage.setItem('sight_words_users', JSON.stringify(newUsers));
    setCurrentUser(name);
  };

  // ... (Existing Game Logic: handleCorrect, handleIncorrect, etc) ...
  const triggerConfetti = () => {
    const duration = 1000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#60A5FA', '#34D399', '#F472B6'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#60A5FA', '#34D399', '#F472B6'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleCorrect = () => {
    setGlobalStats(prev => ({ score: prev.score + 10, streak: prev.streak + 1 }));
    triggerConfetti();
    const newStats = updateWordStats(word, true, wordStats);
    setWordStats(prev => ({ ...prev, [word]: newStats }));
    setWord(getRandomWordV2(mode, wordPool, { ...wordStats, [word]: newStats }));
  };

  const handleIncorrect = () => {
    setGlobalStats(prev => ({ ...prev, streak: 0 }));
    const newStats = updateWordStats(word, false, wordStats);
    setWordStats(prev => ({ ...prev, [word]: newStats }));
    setWord(getRandomWordV2(mode, wordPool, { ...wordStats, [word]: newStats }));
  };

  const handleReset = () => {
    if (confirm(`Reset progress for ${currentUser}?`)) {
      setWordStats({});
      setGlobalStats({ score: 0, streak: 0 });
      // Don't reload, just reset state, effect will save it.
    }
  };

  // If no user selected, show Selector
  if (!currentUser) {
    return (
      <ProfileSelector
        users={users}
        onSelectUser={setCurrentUser}
        onAddUser={handleCreateUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between pb-safe select-none overflow-hidden touch-none">
      <header className="w-full bg-white shadow-sm py-4 mb-2 px-4 flex justify-between items-center relative gap-4 shrink-0">
        {/* User Badge (Back to Selector) */}
        <button
          onClick={() => setCurrentUser(null)}
          className="flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition"
        >
          👤 {currentUser}
        </button>

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

      {/* ScoreBoard - Moved to top for better visibility */}
      <div className="w-full max-w-4xl px-4 shrink-0 z-10">
        <ScoreBoard score={globalStats.score} streak={globalStats.streak} />
      </div>

      {/* Game Content Area - Flex grow but allow shrinking */}
      <div className="flex-grow flex flex-col items-center justify-center w-full min-h-0">
        {gameMode === 'flashcard' && <FlashCardGame word={word} />}
        {gameMode === 'hearing' && <HearingGame word={word} />}
        {gameMode === 'spelling' && (
          <SpellingGame
            word={word}
          />
        )}
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
        onDictionaryToggle={(id) => {
          setActiveDictionaries(prev => {
            if (prev.includes(id)) {
              if (prev.length === 1) return prev;
              return prev.filter(d => d !== id);
            } else {
              return [...prev, id];
            }
          });
        }}
        resetProgress={handleReset}

      // Pass User Mgmt to ParentZone if needed, 
      // but for now the header button switches users.
      // We can add "Manage Users" inside ParentZone later if desired.
      />
    </div>
  );
}

export default App;
