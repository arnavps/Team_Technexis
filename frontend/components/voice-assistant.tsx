"use client";

import { useState, useRef, useEffect } from "react";
import { useOfflineCache } from "@/hooks/useOfflineCache";

interface VoiceAssistantProps {
    dashboardData: any; // The full response from /recommendation
    isEmbedded?: boolean;
    initialQuery?: string;
}

export function VoiceAssistant({ dashboardData, isEmbedded = false, initialQuery = "" }: VoiceAssistantProps) {
    const [isOpen, setIsOpen] = useState(isEmbedded);
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [language, setLanguage] = useState("Hindi");
    const [isSupported, setIsSupported] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { isOnline, cachedData: cachedAiResponse, saveToCache } = useOfflineCache('last_ai_response', '');

    // Web Speech API references
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (initialQuery && !isThinking) {
            setTranscript(initialQuery);
            setResponse(""); // Clear previous response when a new suggestion is clicked
            handleAskVakeel(initialQuery);
        }
    }, [initialQuery]);

    const initRecognition = () => {
        if (typeof window === "undefined") return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        try {
            if (recognitionRef.current) {
                recognitionRef.current.onresult = null;
                recognitionRef.current.onend = null;
                recognitionRef.current.onerror = null;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            if (language === "Hindi") {
                recognition.lang = "hi-IN";
            } else if (language === "Marathi") {
                recognition.lang = "mr-IN";
            } else {
                recognition.lang = "en-US";
            }

            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const text = event.results[current][0].transcript;
                setTranscript(text);
                handleAskVakeel(text);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);

                if (event.error === 'not-allowed') {
                    setErrorMsg("Microphone access denied.");
                } else if (event.error === 'network') {
                    setErrorMsg("Network error.");
                } else {
                    setErrorMsg(`Error: ${event.error}`);
                }
            };

            recognitionRef.current = recognition;
        } catch (e) {
            console.error("Failed to initialize recognition", e);
            setIsSupported(false);
        }
    };

    useEffect(() => {
        initRecognition();

        // Cleanup audio on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, [language]);

    const toggleListen = async () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript("");
            setResponse("");
            setErrorMsg(null);

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

            try {
                // EXPLICITLY request microphone permission first to force mobile browsers to prompt
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    // Immediately stop the stream, we just needed the permission granted for SpeechRecognition
                    stream.getTracks().forEach(track => track.stop());
                }

                recognitionRef.current?.start();
                setIsListening(true);
            } catch (err) {
                console.error("Microphone permission denied or not supported:", err);
                setErrorMsg("Microphone access is required to use the Voice Assistant.");
                setIsListening(false);
            }
        }
    };

    const [lastVoiceName, setLastVoiceName] = useState<string>("MittiMitra TTS Engine");

    const speakResponse = async (text: string) => {
        if (!text) return;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        try {
            const backendUrl = `/api/chat/tts`;
            const res = await fetch(backendUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: text,
                    language: language
                })
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);

                // Speed up Marathi audio playback slightly as the default gTTS voice is inherently slow
                if (language === "Marathi") {
                    audio.playbackRate = 1.35;
                }

                audioRef.current = audio;

                audio.onended = () => {
                    URL.revokeObjectURL(url);
                };

                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Autoplay prevented by mobile browser:", error);
                    });
                }
                setLastVoiceName(`MittiMitra Cloud Voice (${language})`);
            } else {
                console.error("Failed to generate TTS audio.");
            }
        } catch (err) {
            console.error("Error playing audio response", err);
        }
    };

    const handleAskVakeel = async (query: string) => {
        if (!query.trim() || !dashboardData) return;

        // If offline, provide the cached response or a default offline message
        if (!isOnline) {
            const offlineMsg = cachedAiResponse || "Internet connection lost. Please refer to the saved dashboard colors.";
            setResponse(offlineMsg);
            speakResponse(offlineMsg);
            return;
        }

        setIsThinking(true);
        try {
            const backendUrl = `/api/chat/explain`;
            const res = await fetch(backendUrl, {
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
                saveToCache(data.response); // Cache the latest working response for offline resilience
                speakResponse(data.response);
            } else {
                setResponse(language === "English" ? "Sorry, I couldn't connect to the server." : "Maaf kijiye, server se connect nahi ho paya.");
            }
        } catch (error) {
            console.error(error);
            const fallback = cachedAiResponse || "Network error occurred.";
            setResponse(fallback);
            speakResponse(fallback);
        } finally {
            setIsThinking(false);
        }
    };

    const content = (
        <div className={`${isEmbedded ? 'w-full' : 'w-full max-w-lg bg-forest/90 backdrop-blur-xl border border-glass-border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 duration-300'}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-glass-border pb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="w-3 h-3 rounded-full bg-mint animate-pulse mr-2"></span>
                        Agri-Vakeel AI
                    </h3>
                    <p className="text-sm text-gray-400">Ask why you should sell or wait</p>
                </div>
                {!isEmbedded && (
                    <button onClick={() => {
                        setIsOpen(false);
                        if (audioRef.current) audioRef.current.pause();
                    }} className="text-gray-400 hover:text-white p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>

            {/* Language Selection */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['English', 'Hindi', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Punjabi'].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${language === lang
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
                    <div className="self-start bg-mint/10 border border-mint/20 rounded-2xl rounded-tl-none py-3 px-4 max-w-[95%] text-mint whitespace-pre-wrap">
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
                    disabled={!isSupported}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${!isSupported ? 'bg-gray-600 cursor-not-allowed' : isListening
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
                <p className={`text-sm mt-4 font-medium transition-colors ${errorMsg ? 'text-red-400' : 'text-gray-400'}`}>
                    {!isSupported
                        ? "Voice not supported in this browser"
                        : errorMsg
                            ? errorMsg
                            : isListening
                                ? "Listening... Tap to stop"
                                : "Tap to speak with Agri-Vakeel"}
                </p>
                {errorMsg && (
                    <button
                        onClick={() => { setErrorMsg(null); initRecognition(); }}
                        className="text-xs text-mint underline mt-2 hover:text-white"
                    >
                        Try Again
                    </button>
                )}
            </div>

            {/* Voice Engine Diagnostic (Subtle) */}
            {lastVoiceName && (
                <div className="mt-4 flex justify-center">
                    <p className="text-[10px] text-white/20 font-mono tracking-tight uppercase">
                        AI Engine: {lastVoiceName}
                    </p>
                </div>
            )}
        </div>
    );

    if (isEmbedded) return <div className="w-full">{content}</div>;

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

            {/* Glassy Bottom Sheet Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    {content}
                </div>
            )}
        </>
    );
}
