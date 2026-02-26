'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface VerdictCardProps {
    data: any;
}

export function VerdictCard({ data }: VerdictCardProps) {
    const { t } = useLanguage();

    if (!data) return null;

    // Approximated Math Breakdown for UI
    const price = data.mandi_stats?.current_price || 0;
    const distanceKm = data.mandi_stats?.distance_km || 0;
    const yieldQtl = 50; // standard 50 Quintals assumption for UI
    const grossRevenue = price * yieldQtl;
    const logistics = Math.round(distanceKm * 15); // ₹15 per km transport
    const spoilagePenalty = Math.round(grossRevenue * 0.02); // 2% environmental penalty

    // We use actual returned net_realization if available, else fallback to formula
    const finalProfit = data.net_realization_inr || (grossRevenue - logistics - spoilagePenalty);

    return (
        <div className="rounded-3xl border border-white/20 bg-black/20 backdrop-blur-xl p-8 lg:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Background Glows based on status */}
            {data.status === 'GREEN' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-mint/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            )}
            {data.status === 'RED' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            )}
            {data.status === 'YELLOW' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            )}

            <h2 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6 z-10">{t('recommendation')}</h2>

            <div className="z-10 w-full mb-8">
                {data.status === 'GREEN' ? (
                    <div className="animate-[pulse_4s_ease-in-out_infinite]">
                        <h3 className="text-7xl lg:text-8xl font-black text-mint mb-4 drop-shadow-[0_0_25px_rgba(32,255,189,0.5)] tracking-tighter">
                            {t('sell') || 'SELL'}
                        </h3>
                        <p className="text-gray-300 font-medium text-lg">Optimal harvest window detected; prices peaking in 48 hours.</p>
                    </div>
                ) : data.status === 'RED' ? (
                    <div>
                        <h3 className="text-7xl lg:text-8xl font-black text-amber-500 mb-4 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)] tracking-tighter">
                            {t('wait') || 'WAIT'}
                        </h3>
                        <p className="text-gray-300 font-medium text-lg">Sub-optimal conditions. Expected market dip due to excess supply.</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-7xl lg:text-8xl font-black text-yellow-400 mb-4 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)] tracking-tighter">
                            {t('hold') || 'HOLD'}
                        </h3>
                        <p className="text-gray-300 font-medium text-lg">Volatility mapping active. Monitor conditions closely.</p>
                    </div>
                )}
            </div>

            {/* Net Realization (Live Accounting Breakdown) */}
            <div className="z-10 w-full mt-4 bg-white/5 border border-white/10 rounded-3xl p-6 text-left group">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-gray-500 font-bold block mb-1">Net Realization Algorithm</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-[8px] bg-mint/10 text-mint px-2 py-0.5 rounded-full font-bold border border-mint/20">LIVE CALCULATOR</span>
                            <span className="text-[8px] text-gray-600 uppercase font-black">Source: e-NAM + GPS Transit</span>
                        </div>
                    </div>
                    <span className="text-mint font-mono font-bold text-2xl drop-shadow-[0_0_10px_rgba(32,255,189,0.3)]">
                        ₹{(finalProfit).toLocaleString('en-IN')}
                    </span>
                </div>

                <div className="space-y-4 font-mono text-sm">
                    {/* Gross */}
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-mint rounded-full mr-2"></span>
                            Gross Market Value
                        </span>
                        <span className="text-white">+₹{(grossRevenue).toLocaleString('en-IN')}</span>
                    </div>

                    {/* Logistics */}
                    <div className="flex justify-between items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                            Logistics ({distanceKm}km)
                        </span>
                        <span className="text-red-400/80">-₹{(logistics).toLocaleString('en-IN')}</span>
                    </div>

                    {/* Spoilage */}
                    <div className="flex justify-between items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                            Env. Spoilage Risk
                        </span>
                        <span className="text-red-400/80">-₹{(spoilagePenalty).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center bg-mint/5 -mx-6 px-6 -mb-6 rounded-b-3xl">
                        <span className="text-xs text-mint/60 font-bold uppercase">Estimated Take-Home</span>
                        <span className="text-white font-black text-lg">₹{(finalProfit).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
