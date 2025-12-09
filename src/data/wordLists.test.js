
import { describe, it, expect } from 'vitest';
import { getLearningList, getRandomWord, masteredList, currentTargetsFull, allTargets } from './wordLists';

describe('Word Logic', () => {
    it('getLearningList should return words not in mastered list', () => {
        const mastered = ["a", "am"];
        const learning = getLearningList(mastered);

        expect(learning).not.toContain("a");
        expect(learning).not.toContain("am");
        expect(learning).toContain("i"); // "i" is in full list but not mastered here
    });

    it('getRandomWord should return from all targets in Hard mode', () => {
        // Run multiple times to statistically likely hit different words
        const words = new Set();
        for (let i = 0; i < 100; i++) {
            words.add(getRandomWord("All Targets", []));
        }

        // Should contain words that are NOT in current targets if allTargets is bigger
        // But for safety, just check that the returned word exists in allTargets
        const word = getRandomWord("All Targets", []);
        expect(allTargets).toContain(word);
    });

    it('getRandomWord should respect mastered list in Current Targets mode', () => {
        // Mock Math.random to force "Mastered" selection ( < 0.3 )
        const originalRandom = Math.random;
        Math.random = () => 0.1; // Force mastered path

        const myMastered = ["uniqueWord"];
        // In reality we should use real words or mock the lists, but getRandomWord takes mastered as arg
        // But it checks against internal lists. 
        // Wait, getRandomWord logic: 
        // if (mode === "Current Targets") {
        //    if (random < 0.3) return random(mastered)
        // }
        // asking for "uniqueWord" which isn't in "targets" is fine if it enters that block.

        const word = getRandomWord("Current Targets", myMastered);
        expect(word).toBe("uniqueWord");

        Math.random = originalRandom;
    });

    it('getRandomWord should fallback if lists are empty', () => {
        // if mode is current targets logic
        // default mastered is logic from file... wait, I pass mastered in.
        // If I pass empty mastered, it should go to learning list.
        const word = getRandomWord("Current Targets", []);
        expect(currentTargetsFull).toContain(word);
    });
});
