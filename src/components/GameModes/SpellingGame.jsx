
import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTTS } from '../../hooks/useTTS';

// Individual draggable tile
const SortableItem = ({ id, letter }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="w-16 h-16 sm:w-24 sm:h-24 bg-white border-4 border-blue-200 rounded-xl flex items-center justify-center text-4xl sm:text-6xl font-bold text-blue-600 shadow-md cursor-grab active:cursor-grabbing touch-none select-none"
        >
            {letter}
        </div>
    );
};

const SpellingGame = ({ word, onCorrect }) => {
    const { speak } = useTTS();
    const [items, setItems] = useState([]);
    const [showPreview, setShowPreview] = useState(true);

    // Initialize game when word changes
    useEffect(() => {
        setShowPreview(true);
        speak(word);

        // scramble
        const letters = word.split('').map((l, i) => ({ id: `${l}-${i}`, letter: l }));
        // Simple shuffle
        const shuffled = [...letters].sort(() => Math.random() - 0.5);
        setItems(shuffled);

        // Hide preview after 3s (configurable later)
        const timer = setTimeout(() => setShowPreview(false), 3000);
        return () => clearTimeout(timer);
    }, [word, speak]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Check correctness properly here if we wanted auto-submit
                return newItems;
            });
        }
    };

    // Check correctness manually or distinct visual feedback?
    // Current design: user reconstructs, then hits "Check" or we auto-check?
    // The request didn't specify, but "auto-check" is nicer for kids.
    // HOWEVER, the Controls comp has "I Got It" / "Try Again".
    // Let's hook into that? Or provide visual feedback?
    // Visual feedback for spelling is crucial.

    const currentSpelling = items.map(i => i.letter).join('');
    const isCorrect = currentSpelling === word;

    return (
        <div className="w-full flex-grow flex flex-col items-center justify-center max-w-4xl px-4 gap-8 animate-in fade-in duration-500">

            {/* Target Word Preview (Fades out) */}
            <div className={`text-8xl font-black text-slate-200 transition-opacity duration-500 ${showPreview ? 'opacity-100' : 'opacity-0'}`}>
                {word}
            </div>

            {/* Drop Zone / Sortable Context */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className="flex gap-2 sm:gap-4 flex-wrap justify-center min-h-[120px] p-4 bg-slate-100 rounded-3xl">
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} letter={item.letter} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Status Feedback */}
            <div className={`text-2xl font-bold transition-all duration-300 ${isCorrect ? 'text-green-500 scale-110' : 'text-slate-400'}`}>
                {isCorrect ? "✨ Correct! Hit 'I Got It!' ✨" : "Arrange the letters..."}
            </div>

        </div>
    );
};

export default SpellingGame;
