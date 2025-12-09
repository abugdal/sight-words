// Data Lists
export const masteredList = ["a", "am", "i"];

export const currentTargetsFull = [
    "a", "am", "i", "an", "and", "as", "at", "can", "has",
    "him", "his", "in", "is", "it", "of", "on"
];

export const allTargets = [
    "i", "a", "am", "at", "an", "and", "can", "as", "has", "is", "his",
    "him", "on", "of", "in", "it", "or", "for", "was", "saw", "you", "to",
    "do", "are", "said", "one", "get", "had", "ask", "did", "yes", "went",
    "her", "from", "put", "but", "not", "have", "will", "we", "he", "be",
    "me", "she", "see", "no", "go", "so", "by", "my", "like", "with",
    "the", "they"
];

// Helper to get learning list (Dynamic)
export const getLearningList = (mastered) => {
    return currentTargetsFull.filter(w => !mastered.includes(w));
};

export const getRandomWord = (mode = "Current Targets", mastered = []) => {
    const learningList = getLearningList(mastered);

    if (mode === "Current Targets") {
        const isMastered = Math.random() < 0.3;
        // If we rolled "Mastered" but have none, fallback to learning.
        // If we rolled "Learning" but have none, fallback to mastered.
        if (isMastered && mastered.length > 0) {
            return mastered[Math.floor(Math.random() * mastered.length)];
        } else if (learningList.length > 0) {
            return learningList[Math.floor(Math.random() * learningList.length)];
        } else {
            // Fallback if lists are weirdly empty
            return "Done!";
        }
    } else {
        // All Targets (Hard Mode)
        return allTargets[Math.floor(Math.random() * allTargets.length)];
    }
};
