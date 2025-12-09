
import { useEffect, useState } from 'react';
import FlashCard from '../FlashCard';
import { useTTS } from '../../hooks/useTTS';

const HearingGame = ({ word }) => {
    const { speak } = useTTS();
    const [revealed, setRevealed] = useState(false);

    // Speak word when it changes
    useEffect(() => {
        setRevealed(false);
        // Tiny delay to allow transition
        const timer = setTimeout(() => speak(word), 500);
        return () => clearTimeout(timer);
    }, [word, speak]);

    const handleReveal = () => {
        speak(word); // Speak again on reveal
        setRevealed(true);
    };

    return (
        <div className="w-full flex-grow flex flex-col items-center justify-center max-w-4xl px-4 gap-8 animate-in fade-in duration-500">
            {revealed ? (
                <FlashCard word={word} />
            ) : (
                <div className="flex flex-col items-center gap-8">
                    <button
                        onClick={() => speak(word)}
                        className="w-48 h-48 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center shadow-lg transition-transform active:scale-95 border-b-8 border-blue-200"
                        aria-label="Listen Again"
                    >
                        <span className="text-8xl">🔊</span>
                    </button>

                    <p className="text-2xl text-slate-500 font-medium">Listen to the word...</p>

                    <button
                        onClick={handleReveal}
                        className="px-8 py-4 bg-slate-800 text-white rounded-xl text-xl font-bold shadow-md hover:bg-slate-700 transition"
                    >
                        👁️ Reveal
                    </button>
                </div>
            )}
        </div>
    );
};

export default HearingGame;
