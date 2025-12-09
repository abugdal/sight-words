
import FlashCard from '../FlashCard';

const FlashCardGame = ({ word }) => {
    return (
        <div className="w-full flex-grow flex flex-col items-center justify-center max-w-4xl px-4 gap-6 animate-in fade-in duration-500">
            <FlashCard word={word} />
        </div>
    );
};

export default FlashCardGame;
