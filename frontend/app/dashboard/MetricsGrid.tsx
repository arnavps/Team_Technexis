'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface MetricsGridProps {
    data: any;
    onMetricClick: (metric: string, value: number, unit: string) => void;
}

export function MetricsGrid({ data, onMetricClick }: MetricsGridProps) {
    const { t } = useLanguage();

    if (!data) return null;

    // Derived metrics for UI
    const temperature = data.weather?.temperature_c || 28;
    const humidity = data.weather?.humidity_percent || 65;
    const soilMoisture = data.weather?.soil_moisture_percent || 40;
    const spoilageRisk = data.weather?.spoilage_risk || 15;
    const isVerified = data.weather?.is_verified_env || false;

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Avg Temperature */}
            <div
                onClick={() => onMetricClick(t('temp') || 'Temperature', temperature, '°C')}
                className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center shadow-inner hover:bg-white/10 transition-all cursor-pointer group active:scale-95"
            >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <svg className="w-8 h-8 text-orange-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <p className="text-2xl font-bold text-white tracking-tight">{temperature}°C</p>
                <div className="flex flex-col items-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{t('temp')}</p>
                    <p className={`text-[8px] uppercase font-bold tracking-tighter mt-1 ${isVerified ? 'text-mint' : 'text-orange-400/50'}`}>
                        {isVerified ? 'Source: Open-Meteo (Live)' : 'Source: IMD Nowcast'}
                    </p>
                </div>
            </div>

            {/* Humidity */}
            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center shadow-inner hover:bg-white/5 transition-colors">
                <svg className="w-8 h-8 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                <p className="text-2xl font-bold text-white tracking-tight">{humidity}%</p>
                <div className="flex flex-col items-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{t('humidity')}</p>
                    <p className={`text-[8px] uppercase font-bold tracking-tighter mt-1 ${isVerified ? 'text-mint' : 'text-blue-400/50'}`}>
                        {isVerified ? 'Source: Open-Meteo (Live)' : 'Source: IMD Nowcast'}
                    </p>
                </div>
            </div>

            {/* Soil Moisture */}
            <div
                onClick={() => onMetricClick(t('soilMoisture') || 'Soil Moisture', soilMoisture, '%')}
                className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center shadow-inner hover:bg-white/10 transition-all cursor-pointer group active:scale-95"
            >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <svg className="w-8 h-8 text-teal-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                <p className="text-2xl font-bold text-white tracking-tight">{soilMoisture}%</p>
                <div className="flex flex-col items-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{t('soilMoisture') || 'SOIL MOISTURE'}</p>
                    <p className={`text-[8px] uppercase font-bold tracking-tighter mt-1 ${isVerified ? 'text-mint' : 'text-teal-400/50'}`}>
                        {isVerified ? 'Source: Satellite Data (Open-Meteo)' : 'Source: Sensor Node #42'}
                    </p>
                </div>
            </div>

            {/* Spoilage Risk % */}
            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center shadow-inner hover:bg-white/5 transition-colors relative overflow-hidden group">
                {/* Dynamically shade the background depending on risk severity */}
                <div className={`absolute bottom-0 left-0 right-0 opacity-20 transition-all duration-500 ease-in-out group-hover:opacity-30 ${spoilageRisk > 30 ? 'bg-red-500' : spoilageRisk > 15 ? 'bg-yellow-400' : 'bg-mint'
                    }`} style={{ height: `${spoilageRisk}%` }}></div>

                <svg className="w-8 h-8 text-red-400 mb-2 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-2xl font-bold text-white tracking-tight z-10">{spoilageRisk}%</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 z-10">{t('spoilageRisk') || 'SPOILAGE RISK'}</p>
            </div>
        </div>
    );
}
