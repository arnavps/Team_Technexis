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
import { VerdictCard } from './VerdictCard';
import { MetricsGrid } from './MetricsGrid';
import { ManualOverrideModal } from '@/components/dashboard/ManualOverrideModal';
import { auth } from '@/services/firebase';

export default function DashboardPage() {
    const { t, language } = useLanguage();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);
    const [profileName, setProfileName] = useState('');
    const [userCrop, setUserCrop] = useState('');
    const [vakeelQuery, setVakeelQuery] = useState('');
    const [yieldEst, setYieldEst] = useState(50);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const phone = auth.currentUser?.phoneNumber || "9999999999";
                import('@/utils/supabase/client').then(async ({ supabase }) => {
                    import('@/services/firebase').then(async ({ auth }) => {
                        const { data } = await supabase
                            .from('profiles')
                            .select('name, crop')
                            .eq('phone', phone)
                            .single();
                        if (data?.name) setProfileName(data.name);
                        if (data?.crop) setUserCrop(data.crop);
                    });
                });
            } catch (error) {
                console.error("Failed to fetch profile in topbar");
            }
        };
        fetchProfile();
    }, []);

    // Manual Overrides State
    const [overrides, setOverrides] = useState<Record<string, number>>({});
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        metric: string;
        value: number;
        unit: string;
    }>({ isOpen: false, metric: '', value: 0, unit: '' });

    const { location, requestLocation } = useGPS();
    const { isOnline, cachedData, saveToCache } = useOfflineCache('dashboard_recommendation');

    // Trigger re-calculation when overrides or yield change locally
    const recalculateWithOverrides = (currentData: any, newOverrides: Record<string, number>, newYield?: number) => {
        if (!currentData) return;
        const updated = JSON.parse(JSON.stringify(currentData)); // Deep clone
        const activeYield = newYield ?? yieldEst;

        // Mocking the backend logic for immediate UI response
        const tempKey = t('temp') || 'Temperature';
        const soilKey = t('soilMoisture') || 'Soil Moisture';

        if (newOverrides[tempKey]) {
            updated.weather.temperature_c = newOverrides[tempKey];
            if (newOverrides[tempKey] > 35) {
                updated.weather.spoilage_risk = Math.min(100, (updated.weather.spoilage_risk || 0) + 10);
                updated.net_realization_inr -= 500;
            }
        }

        if (newOverrides[soilKey]) {
            updated.weather.soil_moisture = newOverrides[soilKey];
            if (newOverrides[soilKey] > 70) {
                updated.status = "YELLOW";
            }
        }

        updated.is_manual_override = true;
        updated.manual_override_count = Object.keys(newOverrides).length;

        // Update totals based on yield
        const perQuintal = updated.net_realization_inr_per_quintal || (updated.total_net_profit / (updated.yield_quintals || 50));
        updated.total_net_profit = Math.round(perQuintal * activeYield);
        updated.yield_quintals = activeYield;

        setData(updated);
    };

    const handleMetricClick = (metric: string, value: number, unit: string) => {
        setModalConfig({ isOpen: true, metric, value, unit });
    };

    const handleSaveOverride = (newValue: number) => {
        const newOverrides = { ...overrides, [modalConfig.metric]: newValue };
        setOverrides(newOverrides);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        recalculateWithOverrides(data, newOverrides);
    };

    const fetchRecommendation = async (isDemo = false) => {
        setLoading(true);
        try {
            if (!isOnline && cachedData && !isDemo) {
                setData(cachedData);
                setLoading(false);
                return;
            }

            const payload = {
                crop: userCrop || "", // Use saved profile crop, backend handles fallback if empty
                location: { lat: 18.5204, lng: 73.8567 }, // Mock Pune
                yield_est_quintals: yieldEst,
                base_spoilage_rate: 0.05,
                language: language
            };

            const backendUrl = `/api/recommendation`;
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
                    // Mock a pivot mandi for the demo
                    if (json.regional_options && json.regional_options.length > 1) {
                        const pivot = json.regional_options[1];
                        json.shock_alert.pivot_advice += ` Re-routing to ${pivot.mandi_name} (${roundVal(pivot.distance_km)}km).`;
                        json.shock_alert.pivot_mandi = pivot;
                    }
                }

                setData(json);
                setLastFetched(new Date());
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
        fetchRecommendation();
    }, [isOnline, userCrop]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint"></div>
            </div>
        );
    }

    const mandiList = data?.regional_options ? data.regional_options.map((option: any, index: number) => ({
        id: index.toString(),
        name: option.mandi_name,
        distanceKm: roundVal(option.distance_km),
        currentPrice: option.market_price,
        netProfit: option.total_net_profit,
        isOptimal: index === 0 // The backend sorts by most profitable first
    })) : [];

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <header className="relative z-50 flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-2xl font-bold tracking-tight text-white uppercase tracking-tighter">Decision Hub</h1>
                        {userCrop && (
                            <span className="bg-mint text-forest text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-[0_0_10px_rgba(32,255,189,0.3)]">
                                {userCrop}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                        {!isOnline && (
                            <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
                                {t('offlineMode')}
                            </span>
                        )}
                        <p className="text-sm text-gray-400">{t('temporalArbitrageEngine')}</p>
                        {lastFetched && (
                            <div className="flex items-center space-x-1.5 ml-4 border-l border-white/10 pl-4 py-0.5">
                                <span className="w-1.5 h-1.5 bg-mint rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                                    Live Sync: {lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex space-x-3 items-center">
                    <button
                        onClick={() => fetchRecommendation(true)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full transition-colors font-medium border-dashed"
                    >
                        {t('simulateShock')}
                    </button>
                    <div className="w-10 h-10 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center text-mint font-bold shadow-inner">
                        {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
            </header>

            {/* Shock Alert Banner */}
            {(data?.shock_alert?.is_shock || data?.shock_analysis?.z_score > 2) && (
                <ShockAlertBanner
                    message={data?.shock_alert?.message || 'High market volatility detected.'}
                    pivotAdvice={data?.shock_alert?.pivot_advice || ''}
                />
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - The Verdict & Metrics */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Main Verdict Card */}
                    <VerdictCard data={data} userCrop={userCrop} onExplain={(q: string) => setVakeelQuery(q)} />

                    {/* 4-Item Environmental Metrics Grid */}
                    <MetricsGrid
                        data={data}
                        onMetricClick={handleMetricClick}
                        onExplain={(q: string) => setVakeelQuery(q)}
                    />

                    {/* Yield Calibration Card */}
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Yield Calibration</h3>
                            <span className="text-mint font-mono font-bold text-xl">{yieldEst} Qtl</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="500"
                            step="1"
                            value={yieldEst}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setYieldEst(val);
                                recalculateWithOverrides(data, overrides, val);
                            }}
                            onMouseUp={() => fetchRecommendation()}
                            onTouchEnd={() => fetchRecommendation()}
                            className="w-full h-1.5 bg-mint/20 rounded-lg appearance-none cursor-pointer accent-mint mb-2"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                            <span>1 QTL</span>
                            <span>TOTAL FIELD ESTIMATE</span>
                            <span>500 QTL</span>
                        </div>
                        <p className="mt-4 text-[10px] text-gray-400 italic leading-relaxed">
                            Adjust this slider to match your actual harvest volume. Total profit calculations will update instantly.
                        </p>
                    </GlassCard>
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
            <VoiceAssistant dashboardData={data} initialQuery={vakeelQuery} />

            {/* Manual Override Modal */}
            <ManualOverrideModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                currentValue={modalConfig.value}
                metricLabel={modalConfig.metric}
                unit={modalConfig.unit}
                onSave={handleSaveOverride}
            />
        </div>
    );
}

// helper
function roundVal(num: number) {
    return Math.round(num * 10) / 10;
}
