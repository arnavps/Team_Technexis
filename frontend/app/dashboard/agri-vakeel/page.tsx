'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/glass-card';
import { VoiceAssistant } from '@/components/voice-assistant';
import { useGPS } from '@/hooks/useGPS';
import { useOfflineCache } from '@/hooks/useOfflineCache';

export default function AgriVakeelPage() {
    const { t } = useLanguage();
    const { location, requestLocation } = useGPS();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [initialQuery, setInitialQuery] = useState("");
    const { isOnline, cachedData, saveToCache } = useOfflineCache('last_recommendation', null);

    const fetchRecommendation = async (coords: { latitude: number, longitude: number }) => {
        try {
            const payload = {
                crop: "Tomato",
                location: { lat: coords.latitude, lng: coords.longitude },
                yield_est_quintals: 50.0,
                base_spoilage_rate: 0.05
            };

            const res = await fetch('http://localhost:8000/recommendation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const json = await res.json();
                setData(json);
                saveToCache(json);
            }
        } catch (err) {
            console.error("Failed to fetch recommendation", err);
            if (cachedData) setData(cachedData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        requestLocation();
    }, []);

    useEffect(() => {
        if (location) {
            fetchRecommendation(location);
        } else {
            // Fallback to mock Pune location if GPS takes too long or is denied
            const timer = setTimeout(() => {
                if (!data && !location) {
                    fetchRecommendation({ latitude: 18.5204, longitude: 73.8567 });
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const handleSuggestionClick = (query: string) => {
        setInitialQuery(query);
    };

    if (loading && !data) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 pb-24">
            <header className="relative z-50 flex flex-col mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Agri-Vakeel AI</h1>
                <p className="text-sm text-gray-400">Your Personal AI Agricultural Consultant</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Suggestions */}
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-white font-bold mb-2">Suggestions</h2>
                    <div className="grid grid-cols-1 gap-4 w-full">
                        <button
                            onClick={() => handleSuggestionClick("Why is nashik price dropping?")}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors w-full group"
                        >
                            <p className="text-xs text-mint font-bold uppercase mb-1 group-hover:text-white transition-colors">Market Insight</p>
                            <p className="text-sm text-gray-300 italic group-hover:text-gray-100 transition-colors">"Why is nashik price dropping?"</p>
                        </button>
                        <button
                            onClick={() => handleSuggestionClick("Should I wait 2 days to harvest?")}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors w-full group"
                        >
                            <p className="text-xs text-mint font-bold uppercase mb-1 group-hover:text-white transition-colors">Strategy</p>
                            <p className="text-sm text-gray-300 italic group-hover:text-gray-100 transition-colors">"Should I wait 2 days to harvest?"</p>
                        </button>
                        <button
                            onClick={() => handleSuggestionClick("Is there a rain spike tonight?")}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors w-full group"
                        >
                            <p className="text-xs text-mint font-bold uppercase mb-1 group-hover:text-white transition-colors">Weather Risk</p>
                            <p className="text-sm text-gray-300 italic group-hover:text-gray-100 transition-colors">"Is there a rain spike tonight?"</p>
                        </button>
                        <button
                            onClick={() => handleSuggestionClick("Which mandi gives most net profit?")}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors w-full group"
                        >
                            <p className="text-xs text-mint font-bold uppercase mb-1 group-hover:text-white transition-colors">Arbitrage</p>
                            <p className="text-sm text-gray-300 italic group-hover:text-gray-100 transition-colors">"Which mandi gives most net profit?"</p>
                        </button>
                    </div>
                </div>

                {/* Right/Main Column - AI Assistant */}
                <div className="md:col-span-2">
                    <div className="rounded-3xl border border-white/20 bg-black/20 backdrop-blur-xl p-6 lg:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                        <div className="z-10 w-full">
                            <VoiceAssistant
                                dashboardData={data}
                                isEmbedded={true}
                                initialQuery={initialQuery}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
                <p className="text-gray-300 text-sm leading-relaxed text-center">
                    <span className="text-mint font-bold">Pro Tip:</span> You can speak in <span className="text-white font-medium">Hindi</span> or <span className="text-white font-medium">Marathi</span>. I'll automatically detect your language and respond accordingly.
                </p>
            </div>
        </div>
    );
}
