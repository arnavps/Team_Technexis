"use client";

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/glass-card';
import { StatusPill } from '@/components/status-pill';
import { ShockAlertBanner } from '@/components/shock-alert-banner';
import { VoiceAssistant } from '@/components/voice-assistant';
import { MandiTable } from './MandiTable';
import { useGPS } from '@/hooks/useGPS';
import { useOfflineCache } from '@/hooks/useOfflineCache';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/language-switcher';
import { VerdictCard } from './VerdictCard';
import { MetricsGrid } from './MetricsGrid';

export default function DashboardPage() {
    const { t } = useLanguage();
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

            const backendUrl = `http://${window.location.hostname}:8000/recommendation`;
            const res = await fetch(backendUrl, {
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
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <header className="relative z-50 flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Decision Hub</h1>
                    <div className="flex items-center space-x-3">
                        {!isOnline && (
                            <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
                                {t('offlineMode')}
                            </span>
                        )}
                        <p className="text-sm text-gray-400">{t('temporalArbitrageEngine')}</p>
                    </div>
                </div>
                <div className="flex space-x-3 items-center">
                    <LanguageSwitcher />
                    <button
                        onClick={() => fetchRecommendation(true)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full transition-colors font-medium border-dashed"
                    >
                        {t('simulateShock')}
                    </button>
                    <div className="w-10 h-10 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center text-mint font-bold shadow-inner">
                        R
                    </div>
                </div>
            </header>

            {/* Z-score > 2 Volatility Insight Banner */}
            {data?.shock_analysis?.z_score > 2 && (
                <ShockAlertBanner
                    message=""
                    pivotAdvice=""
                />
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - The Verdict & Metrics */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Main Verdict Card */}
                    <VerdictCard data={data} />

                    {/* 4-Item Environmental Metrics Grid */}
                    <MetricsGrid data={data} />
                </div>

                {/* Right Column - Deep Analytics */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">{t('marketOrbit')}</h3>
                            <StatusPill status="GREEN" message={t('liveData')} />
                        </div>
                        <p className="text-sm text-gray-400 mb-6">{t('mandiDesc')}</p>
                        <MandiTable mandis={mandiList} />
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
