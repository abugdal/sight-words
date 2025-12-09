
import { useState } from 'react';

const ProfileSelector = ({ users, onSelectUser, onAddUser }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");

    const handleCreate = (e) => {
        e.preventDefault();
        if (newName.trim()) {
            onAddUser(newName.trim());
            setNewName("");
            setIsAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 animate-in fade-in zoom-in duration-500">
                <h1 className="text-3xl font-bold text-center text-slate-700 mb-8">Who is Playing?</h1>

                <div className="grid grid-cols-1 gap-4 mb-8">
                    {users.map((user) => (
                        <button
                            key={user}
                            onClick={() => onSelectUser(user)}
                            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xl font-bold group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                {user.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xl font-bold text-slate-700">{user}</span>
                        </button>
                    ))}
                </div>

                {isAdding ? (
                    <form onSubmit={handleCreate} className="animate-in fade-in slide-in-from-bottom-2">
                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full p-4 rounded-xl border-2 border-blue-200 text-xl text-center focus:border-blue-500 outline-none mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!newName.trim()}
                                className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 disabled:opacity-50"
                            >
                                Start
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 font-bold hover:border-slate-400 hover:text-slate-500 hover:bg-slate-50 transition-all"
                    >
                        + Add New Player
                    </button>
                )}

            </div>
        </div>
    );
};

export default ProfileSelector;
