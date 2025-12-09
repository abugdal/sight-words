import { dictionaries } from './dictionaries';

// --- DATA STRUCTURES ---
// WordStats Map:
// {
//   "a": { correct: 5, incorrect: 0, streak: 5, status: 'mastered' },
//   "the": { correct: 1, incorrect: 2, streak: 0, status: 'learning' }
// }

export const MASTERY_THRESHOLD = 5;

// Helper to merge all active dictionaries into one list of words
export const getActiveWordPool = (activeDictionaryIds) => {
    const pool = new Set();
    activeDictionaryIds.forEach(id => {
        if (dictionaries[id]) {
            dictionaries[id].words.forEach(w => pool.add(w));
        }
    });
    return Array.from(pool);
};

// Calculation of Learning vs Mastered
export const categorizeWords = (wordPool, wordStats) => {
    const mastered = [];
    const learning = [];

    wordPool.forEach(word => {
        const stats = wordStats[word];
        if (stats && stats.status === 'mastered') {
            mastered.push(word);
        } else {
            learning.push(word);
        }
    });

    return { mastered, learning };
};

export const getRandomWordV2 = (mode, wordPool, wordStats) => {
    const { mastered, learning } = categorizeWords(wordPool, wordStats);

    // Safety fallback
    if (mastered.length === 0 && learning.length === 0) return "Done!";

    if (mode === "Current Targets") {
        const wantMastered = Math.random() < 0.3;

        if (wantMastered && mastered.length > 0) {
            return mastered[Math.floor(Math.random() * mastered.length)];
        } else if (learning.length > 0) {
            return learning[Math.floor(Math.random() * learning.length)];
        } else {
            // Fallbacks if one list is empty
            return mastered.concat(learning)[Math.floor(Math.random() * (mastered.length + learning.length))];
        }
    } else {
        // "All Targets" just picks from the whole pool regardless of status
        return wordPool[Math.floor(Math.random() * wordPool.length)];
    }
};

export const updateWordStats = (word, isCorrect, currentStats = {}) => {
    // Default stats if new word
    const stats = currentStats[word] || { correct: 0, incorrect: 0, streak: 0, status: 'learning' };

    const newStats = { ...stats };

    if (isCorrect) {
        newStats.correct += 1;
        newStats.streak += 1;

        // Promotion Logic
        if (newStats.streak >= MASTERY_THRESHOLD) {
            newStats.status = 'mastered';
        }
    } else {
        newStats.incorrect += 1;
        newStats.streak = 0; // Reset streak on miss

        // Demotion Logic: Immediate drop on error
        if (newStats.status === 'mastered') {
            newStats.status = 'learning';
        }
    }

    return newStats;
};
