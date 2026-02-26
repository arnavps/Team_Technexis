"use client";

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/glass-card';
import { StatusPill } from '@/components/status-pill';
import { ShockAlertBanner } from '@/components/shock-alert-banner';
import { VoiceAssistant } from '@/components/voice-assistant';
import { MandiTable } from './MandiTable';
import { useGPS } from '@/hooks/useGPS';
import { useOfflineCache } from '@/hooks/useOfflineCache';

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { location, requestLocation } = useGPS();
    const { isOnline, cachedData, saveToCache } = useOfflineCache('dashboard_recommendation');

    const fetchRecommendation = async (isDemo = false) => {
        setLoading(true);
        try {
            if (!isOnline && cachedData && !isDemo) {
                setData(cachedData);
                setLoading(false);
                return;
            }

            const payload = {
                crop: "Tomato",
                location: { lat: 18.5204, lng: 73.8567 }, // Mock Pune
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

                // Demo Mode Override logic
                if (isDemo) {
                    json.mandi_stats.current_price *= 0.6; // 40% drop
                    json.mandi_stats.current_volume_quintals *= 3; // Massive spike
                    json.status = "RED";
                    json.shock_alert = {
                        is_shock: true,
                        message: "CRITICAL: Price crashed by 3.5σ below the 7-day average. Massive volume spike detected!",
                        pivot_advice: "EMERGENCY: Sudden price crash detected. Redirecting you to the nearest cold storage to save your asset."
                    };
                }

                setData(json);
                saveToCache(json);
            }
        } catch (err) {
            console.error("Failed to fetch recommendation", err);
            // Fallback to cache if network fails while technically 'online'
            if (cachedData) setData(cachedData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendation();
    }, [isOnline]); // Re-run when coming back online

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint"></div>
            </div>
        );
    }

    // Generate mock mandi list for the table based on API response
    const mandiList = data ? [
        {
            id: "1",
            name: data.best_mandi,
            distanceKm: roundVal(data.mandi_stats.distance_km),
            currentPrice: data.mandi_stats.current_price,
            netProfit: data.net_realization_inr,
            isOptimal: true
        },
        {
            id: "2",
            name: "Solapur APMC",
            distanceKm: roundVal(data.mandi_stats.distance_km + 45),
            currentPrice: data.mandi_stats.current_price - 2.5,
            netProfit: data.net_realization_inr - 1200,
            isOptimal: false
        },
        {
            id: "3",
            name: "Nashik Onion Market",
            distanceKm: roundVal(data.mandi_stats.distance_km + 110),
            currentPrice: data.mandi_stats.current_price + 4.0,
            netProfit: data.net_realization_inr - 900, // Higher transport eats profit
            isOptimal: false
        }
    ] : [];

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1"><span className="text-mint">Mitti</span>Mitra</h1>
                        {!isOnline && (
                            <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></span>
                                Offline Mode
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400">Temporal Arbitrage Engine</p>
                </div>
                <div className="flex space-x-3 items-center">
                    <button
                        onClick={() => fetchRecommendation(true)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full transition-colors font-medium border-dashed"
                    >
                        Simulate Shock ⚡
                    </button>
                    <div className="w-10 h-10 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center text-mint font-bold shadow-inner">
                        R
                    </div>
                </div>
            </header>

            {/* Dynamic Shock Alert - Only renders if there's an active shock */}
            {data?.shock_alert && data.shock_alert.is_shock && (
                <ShockAlertBanner
                    message={data.shock_alert.message}
                    pivotAdvice={data.shock_alert.pivot_advice}
                />
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - The Verdict & Metrics */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Main Verdict Card */}
                    <GlassCard className="flex flex-col items-center justify-center text-center py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-mint/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                        <h2 className="text-gray-300 uppercase tracking-widest text-xs font-bold mb-6">Recommendation</h2>

                        {data?.status === 'GREEN' ? (
                            <div className="animate-[pulse_4s_ease-in-out_infinite]">
                                <h3 className="text-6xl font-black text-mint mb-4 drop-shadow-[0_0_15px_rgba(32,255,189,0.5)]">SELL</h3>
                                <p className="text-gray-300 font-medium">Optimal Window Detected</p>
                            </div>
                        ) : data?.status === 'RED' ? (
                            <div>
                                <h3 className="text-6xl font-black text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">WAIT</h3>
                                <p className="text-gray-300 font-medium">Sub-optimal Conditions</p>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-6xl font-black text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">HOLD</h3>
                                <p className="text-gray-300 font-medium">Monitor Conditions Closely</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-glass-border w-full">
                            <p className="text-sm text-gray-400 mb-1">Max Projected Realization</p>
                            <p className="text-3xl font-bold text-white">₹{data?.net_realization_inr?.toLocaleString('en-IN')}</p>
                        </div>
                    </GlassCard>

                    {/* Environmental Metrics Grid flex layout */}
                    <div className="grid grid-cols-2 gap-4">
                        <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                            <svg className="w-8 h-8 text-orange-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            <p className="text-2xl font-bold text-white">{data?.weather?.temperature_c || '--'}°C</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Temp</p>
                        </GlassCard>
                        <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                            <svg className="w-8 h-8 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                            <p className="text-2xl font-bold text-white">{data?.weather?.humidity_percent || '--'}%</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Humidity</p>
                        </GlassCard>
                        <GlassCard className="p-4 flex flex-col items-center justify-center text-center col-span-2">
                            <svg className="w-8 h-8 text-mint mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            <p className="text-2xl font-bold text-white">Tomato</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Active Crop Profile</p>
                        </GlassCard>
                    </div>
                </div>

                {/* Right Column - Deep Analytics */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Market Orbit (Net Profit Ranking)</h3>
                            <StatusPill status="GREEN" message="Live Data" />
                        </div>
                        <p className="text-sm text-gray-400 mb-6">Mandi markets ranked by actual realization after deducting standard transport and distance-based spoilage.</p>
                        <MandiTable mandis={mandiList} />
                    </GlassCard>

                    <GlassCard>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Agri-Vakeel AI (Explanation)</h3>
                        </div>
                        <div className="bg-forest border border-glass-border rounded-xl p-5 relative">
                            <div className="absolute top-5 left-5 w-8 h-8 rounded-full bg-mint flex items-center justify-center text-forest font-bold">
                                AI
                            </div>
                            <div className="pl-12">
                                <p className="text-gray-200 leading-relaxed">
                                    {data?.status === 'GREEN'
                                        ? "Current Mandi prices are slightly above the 7-day average. The weather is optimal for transit with no rain expected. Harvesting now will secure your margins before the weekend supply drop."
                                        : "Conditions are highly unstable. My recommendation is to delay harvest or pivot immediately according to the alert above to avoid distress sales."
                                    }
                                </p>
                                <div className="mt-4 flex space-x-3">
                                    <button className="px-4 py-2 rounded-full bg-glass-bg border border-glass-border text-xs font-semibold text-mint hover:bg-white/5 transition-colors flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h2.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                        Listen in Hindi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

            </div>

            {/* Floating Voice Assistant */}
            <VoiceAssistant dashboardData={data} />
        </div>
    );
}

// helper
function roundVal(num: number) {
    return Math.round(num * 10) / 10;
}
