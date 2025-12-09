
const ScoreBoard = ({ score, streak }) => {
    return (
        <div className="flex justify-between items-center w-full max-w-2xl px-6 py-4">
            <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-2xl flex flex-col items-center min-w-[120px]">
                <span className="text-sm font-bold uppercase tracking-wider">Score</span>
                <span className="text-3xl font-black">{score}</span>
            </div>

            <div className="bg-orange-100 text-orange-800 px-6 py-3 rounded-2xl flex flex-col items-center min-w-[120px]">
                <span className="text-sm font-bold uppercase tracking-wider">Streak</span>
                <span className="text-3xl font-black">🔥 {streak}</span>
            </div>
        </div>
    );
};

export default ScoreBoard;
