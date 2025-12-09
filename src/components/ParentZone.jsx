
import { dictionaries } from '../data/dictionaries';

const ParentZone = ({
    isOpen,
    onClose,
    currentMode,
    onModeChange,
    stats,
    activeDictionaries,
    onDictionaryToggle,
    resetProgress
}) => {
    if (!isOpen) return null;

    // Calculate high-level stats based on word_stats map
    const masteredCount = Object.values(stats.word_stats || {}).filter(s => s.status === 'mastered').length;
    const totalWordsSeen = Object.keys(stats.word_stats || {}).length;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <header className="bg-slate-100 px-6 py-4 flex justify-between items-center border-b border-slate-200 shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Parents' Corner</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 bg-slate-200 p-2 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </header>

                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Mode Selection */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-slate-700">Select Mode</h3>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name="mode"
                                    checked={currentMode === "Current Targets"}
                                    onChange={() => onModeChange("Current Targets")}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="font-medium text-slate-900">Current Targets</div>
                                    <div className="text-sm text-slate-500">Focus on learning (70/30 split)</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name="mode"
                                    checked={currentMode === "All Targets"}
                                    onChange={() => onModeChange("All Targets")}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="font-medium text-slate-900">All Targets (Hard)</div>
                                    <div className="text-sm text-slate-500">Every word in active packs</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Dictionary Selection */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-slate-700">Word Packs</h3>
                        <div className="space-y-2">
                            {Object.entries(dictionaries).map(([id, dict]) => (
                                <label key={id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={activeDictionaries.includes(id)}
                                        onChange={() => onDictionaryToggle(id)}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-slate-700">{dict.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Stats / Info */}
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">Stats</h4>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-blue-700">Words Mastered:</span>
                            <span className="font-bold text-blue-900 text-lg">{masteredCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Total Words Seen:</span>
                            <span className="font-bold text-blue-900 text-lg">{totalWordsSeen}</span>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4 border-t border-slate-100">
                        <button
                            onClick={resetProgress}
                            className="text-xs text-red-500 hover:text-red-700 underline"
                        >
                            Reset All Progress (V2 Format)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentZone;
