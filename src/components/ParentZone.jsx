
import { dictionaries } from '../data/dictionaries';

const ParentZone = ({
    isOpen,
    onClose,
    currentMode,
    onModeChange,
    currentGameMode,
    onGameModeChange,
    previewDuration,
    onPreviewDurationChange,
    stats,
    activeDictionaries,
    onDictionaryToggle,
    resetProgress
}) => {
    if (!isOpen) return null;

    const masteredCount = Object.values(stats.word_stats || {}).filter(s => s.status === 'mastered').length;
    const totalWordsSeen = Object.keys(stats.word_stats || {}).length;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <header className="bg-slate-100 px-6 py-4 flex justify-between items-center border-b border-slate-200 shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Parents' Corner</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 bg-slate-200 p-2 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
                </header>

                <div className="p-6 space-y-6 overflow-y-auto">

                    {/* GAME MODE SELECTION (New) */}
                    <div className="space-y-3 bg-purple-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-purple-900 uppercase tracking-wide text-sm">Game Style</h3>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer">
                                <input type="radio" name="gameMode"
                                    checked={currentGameMode === "flashcard"}
                                    onChange={() => onGameModeChange("flashcard")}
                                    className="text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-slate-900 font-medium">Standard Flashcards</span>
                            </label>
                            <label className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer">
                                <input type="radio" name="gameMode"
                                    checked={currentGameMode === "hearing"}
                                    onChange={() => onGameModeChange("hearing")}
                                    className="text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-slate-900 font-medium">Hearing Mode (Audio First)</span>
                            </label>
                            <label className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer">
                                <input type="radio" name="gameMode"
                                    checked={currentGameMode === "spelling"}
                                    onChange={() => onGameModeChange("spelling")}
                                    className="text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-slate-900 font-medium">Spelling Mode (Drag & Drop)</span>
                            </label>
                        </div>

                        {currentGameMode === "spelling" && (
                            <div className="mt-2 pt-2 border-t border-purple-100">
                                <label className="text-sm text-purple-800 font-medium block mb-1">Preview Duration:</label>
                                <select
                                    value={previewDuration}
                                    onChange={(e) => onPreviewDurationChange(Number(e.target.value))}
                                    className="w-full rounded p-2 border border-slate-300 text-sm"
                                >
                                    <option value={1000}>1 Second</option>
                                    <option value={3000}>3 Seconds</option>
                                    <option value={5000}>5 Seconds</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Word List Strategy */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">Difficulty Strategy</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onModeChange("Current Targets")}
                                className={`flex-1 p-3 rounded-lg border border-slate-200 text-center text-sm font-medium transition ${currentMode === "Current Targets" ? 'bg-blue-100 border-blue-300 text-blue-900' : 'hover:bg-slate-50'}`}
                            >
                                Current Targets
                                <span className="block text-xs font-normal opacity-70 mt-1">70/30 Learning Split</span>
                            </button>
                            <button
                                onClick={() => onModeChange("All Targets")}
                                className={`flex-1 p-3 rounded-lg border border-slate-200 text-center text-sm font-medium transition ${currentMode === "All Targets" ? 'bg-orange-100 border-orange-300 text-orange-900' : 'hover:bg-slate-50'}`}
                            >
                                All Targets
                                <span className="block text-xs font-normal opacity-70 mt-1">Full Challenge</span>
                            </button>
                        </div>
                    </div>

                    {/* Dictionaries */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">Word Packs</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.entries(dictionaries).map(([id, dict]) => (
                                <label key={id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 cursor-pointer border border-slate-100">
                                    <input
                                        type="checkbox"
                                        checked={activeDictionaries.includes(id)}
                                        onChange={() => onDictionaryToggle(id)}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-slate-700 font-medium">{dict.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Stats / Info */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Progress</h4>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-700">Mastered:</span>
                            <span className="font-bold text-slate-900">{masteredCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-700">Total Seen:</span>
                            <span className="font-bold text-slate-900">{totalWordsSeen}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button onClick={resetProgress} className="text-xs text-red-500 hover:text-red-700 underline">
                            Reset All Progress (V2 Format)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentZone;
