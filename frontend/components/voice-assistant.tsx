"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceAssistantProps {
    dashboardData: any; // The full response from /recommendation
}

export function VoiceAssistant({ dashboardData }: VoiceAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [language, setLanguage] = useState("Hindi");

    // Web Speech API references
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        // Initialize Speech Synthesis
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            synthRef.current = window.speechSynthesis;
        }

        // Initialize Speech Recognition
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;

                // Dynamically set language based on selection
                recognitionRef.current.lang = language === "Hindi" ? "hi-IN" : "mr-IN";

                recognitionRef.current.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const text = event.results[current][0].transcript;
                    setTranscript(text);
                    handleAskVakeel(text);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };
            }
        }
    }, [language]);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript("");
            setResponse("");
            if (synthRef.current) synthRef.current.cancel();
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakResponse = (text: string) => {
        if (!synthRef.current) return;

        synthRef.current.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find an appropriate voice
        const voices = synthRef.current.getVoices();
        const targetLang = language === "Hindi" ? "hi-IN" : "mr-IN";
        const voice = voices.find(v => v.lang.includes(targetLang) || v.lang.includes('hi'));

        if (voice) utterance.voice = voice;
        utterance.rate = 0.9; // Slightly slower for comprehension

        synthRef.current.speak(utterance);
    };

    const handleAskVakeel = async (query: string) => {
        if (!query.trim() || !dashboardData) return;

        setIsThinking(true);
        try {
            const res = await fetch("http://localhost:8000/chat/explain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    farmer_query: query,
                    dashboard_context: dashboardData,
                    language: language
                })
            });

            if (res.ok) {
                const data = await res.json();
                setResponse(data.response);
                speakResponse(data.response);
            } else {
                setResponse("Maaf kijiye, server se connect nahi ho paya. (Sorry, couldn't connect to the server.)");
            }
        } catch (error) {
            console.error(error);
            setResponse("Network error occurred.");
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-mint shadow-[0_4px_30px_rgba(32,255,189,0.3)] flex items-center justify-center text-forest hover:scale-105 transition-transform z-40 border-2 border-mint/50"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>

            {/* Glassy Bottom Sheet */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-forest/90 backdrop-blur-xl border border-glass-border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative translate-y-0 sm:translate-y-0 animate-in slide-in-from-bottom-10 duration-300">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 border-b border-glass-border pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-mint animate-pulse mr-2"></span>
                                    Agri-Vakeel AI
                                </h3>
                                <p className="text-sm text-gray-400">Ask why you should sell or wait</p>
                            </div>
                            <button onClick={() => { setIsOpen(false); synthRef.current?.cancel(); }} className="text-gray-400 hover:text-white p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Language Selection */}
                        <div className="flex space-x-2 mb-6">
                            {['Hindi', 'Marathi'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${language === lang
                                            ? 'bg-mint text-forest'
                                            : 'bg-glass-bg border border-glass-border text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        {/* Chat History / Transcript Area */}
                        <div className="min-h-[150px] mb-6 flex flex-col justify-end space-y-4">
                            {transcript && (
                                <div className="self-end bg-white/10 border border-glass-border rounded-2xl rounded-tr-none py-2 px-4 max-w-[85%] text-gray-200">
                                    "{transcript}"
                                </div>
                            )}

                            {isThinking && (
                                <div className="self-start py-2 px-4 flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-mint animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-mint animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-mint animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            )}

                            {response && (
                                <div className="self-start bg-mint/10 border border-mint/20 rounded-2xl rounded-tl-none py-3 px-4 max-w-[95%] text-mint">
                                    {response}
                                </div>
                            )}
                        </div>

                        {/* Voice Control Button & Waveform */}
                        <div className="flex flex-col items-center justify-center mt-8">
                            {isListening && (
                                <div className="flex items-center justify-center space-x-1 mb-4 h-8">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 bg-mint rounded-full animate-waveform"
                                            style={{ height: `${Math.max(20, Math.random() * 100)}%`, animationDelay: `${i * 0.1}s` }}
                                        ></div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={toggleListen}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening
                                        ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                                        : 'bg-mint text-forest shadow-[0_0_15px_rgba(32,255,189,0.2)] hover:scale-105'
                                    }`}
                            >
                                {isListening ? (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                )}
                            </button>
                            <p className="text-gray-400 text-sm mt-4 font-medium">
                                {isListening ? "Listening... Tap to stop" : "Tap to speak with Agri-Vakeel"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
