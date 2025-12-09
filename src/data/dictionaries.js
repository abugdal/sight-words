// Dictionaries definition
// Each dictionary is just a simple array of strings.
// Grouped by keys for easy lookup.

export const dictionaries = {
    sight_words_k: {
        name: "Kindergarten Sight Words",
        words: [
            "a", "am", "i", "an", "and", "as", "at", "can", "has",
            "him", "his", "in", "is", "it", "of", "on", "the", "to",
            "we", "you", "are", "do", "for", "go", "have", "he",
            "here", "me", "my", "no", "play", "said", "see", "she",
            "so", "up", "was", "with"
        ]
    },
    sight_words_1: {
        name: "First Grade Sight Words",
        words: [
            "after", "again", "an", "any", "ask", "by", "could", "every",
            "fly", "from", "give", "going", "had", "has", "her", "him",
            "his", "how", "just", "know", "let", "live", "may", "of",
            "old", "once", "open", "over", "put", "round", "some", "stop",
            "take", "thank", "them", "then", "think", "walk", "were", "when"
        ]
    },
    dinosaurs: {
        name: "Dinosaurs (Fun)",
        words: [
            "rex", "dino", "egg", "roar", "big", "run", "tail", "claw",
            "tooth", "bone", "fossil", "bird", "fly", "dig"
        ]
    }
};

export const defaultDictionaryId = "sight_words_k";
