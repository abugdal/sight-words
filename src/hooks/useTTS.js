
import { useState, useEffect, useCallback } from 'react';

export const useTTS = () => {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            setVoices(available);

            // Default to a female English voice if possible (often clearer for kids)
            // or Google US English
            const preferred = available.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
            if (preferred) setSelectedVoice(preferred);
            else setSelectedVoice(available[0]);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const speak = useCallback((text) => {
        if (!text) return;

        // Cancel previous
        window.speechSynthesis.cancel();
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;

        // Slower rate for clear enunciation for kids
        utterance.rate = 0.8;
        utterance.pitch = 1.1;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [selectedVoice]);

    return { speak, isSpeaking, voices, setVoice: setSelectedVoice };
};
