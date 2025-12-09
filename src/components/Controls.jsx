
const Controls = ({ onCorrect, onIncorrect }) => {
    return (
        <div className="w-full max-w-2xl px-4 grid grid-cols-2 gap-4 mb-8">
            <button
                onClick={onIncorrect}
                className="btn-secondary flex items-center justify-center gap-2"
                aria-label="Try Again"
            >
                <span>❌</span>
                <span className="hidden sm:inline">Try Again</span>
            </button>

            <button
                onClick={onCorrect}
                className="btn-primary flex items-center justify-center gap-2"
                aria-label="I Got It"
            >
                <span>✅</span>
                <span className="hidden sm:inline">I Got It!</span>
            </button>
        </div>
    );
};

export default Controls;
