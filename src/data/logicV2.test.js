
import { describe, it, expect } from 'vitest';
import { categorizeWords, updateWordStats, getRandomWordV2, getActiveWordPool } from './logicV2';
import { dictionaries } from './dictionaries';

describe('V2 Logic', () => {
    it('getActiveWordPool combines dicts', () => {
        // Mock dictionaries just for this test via direct access? 
        // Or just test using real ones.
        const pool = getActiveWordPool(['sight_words_k']);
        expect(pool).toContain('a');
        expect(pool).not.toContain('dino'); // Dino is in other dict

        const pool2 = getActiveWordPool(['sight_words_k', 'dinosaurs']);
        expect(pool2).toContain('a');
        expect(pool2).toContain('dino');
    });

    it('updateWordStats increments correctly', () => {
        let stats = updateWordStats("test", true, {});
        expect(stats.correct).toBe(1);
        expect(stats.streak).toBe(1);
        expect(stats.status).toBe('learning');

        // Test Promotion
        stats = { correct: 4, incorrect: 0, streak: 4, status: 'learning' };
        stats = updateWordStats("test", true, { "test": stats });
        expect(stats.streak).toBe(5);
        expect(stats.status).toBe('mastered');
    });

    it('updateWordStats handles demotion', () => {
        let stats = { correct: 10, incorrect: 0, streak: 10, status: 'mastered' };
        stats = updateWordStats("test", false, { "test": stats });

        expect(stats.streak).toBe(0);
        expect(stats.incorrect).toBe(1);
        expect(stats.status).toBe('learning');
    });

    it('categorizeWords splits correctly', () => {
        const pool = ["a", "b", "c"];
        const stats = {
            "a": { status: 'mastered' },
            "b": { status: 'learning' }
            // c has no stats
        };

        const { mastered, learning } = categorizeWords(pool, stats);
        expect(mastered).toEqual(["a"]);
        expect(learning).toContain("b");
        expect(learning).toContain("c"); // No stats = learning
    });
});
