"use client";
import { useLanguage } from '@/contexts/LanguageContext';

interface Mandi {
    id: string;
    name: string;
    distanceKm: number;
    currentPrice: number;
    netProfit: number;
    isOptimal: boolean;
}

export function MandiTable({ mandis }: { mandis: Mandi[] }) {
    const { t } = useLanguage();
    // Sort mandis by net profit descending
    const sortedMandis = [...mandis].sort((a, b) => b.netProfit - a.netProfit);

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-glass-border bg-glass-bg backdrop-blur-md">
            <table className="w-full text-left text-sm text-gray-200">
                <thead className="bg-forest/50 text-xs uppercase text-gray-300 border-b border-glass-border">
                    <tr>
                        <th scope="col" className="px-6 py-4">{t('mandi')}</th>
                        <th scope="col" className="px-6 py-4">{t('dist')}</th>
                        <th scope="col" className="px-6 py-4">{t('price')}</th>
                        <th scope="col" className="px-6 py-4 font-bold text-mint">{t('netProfit')}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedMandis.map((mandi) => (
                        <tr
                            key={mandi.id}
                            className={`border-b border-glass-border last:border-0 hover:bg-white/5 transition-all duration-300 ${mandi.isOptimal
                                ? 'bg-mint/10 border-mint/30 shadow-[0_0_20px_rgba(32,255,189,0.15)] relative z-10'
                                : ''
                                }`}
                        >
                            <td className="px-6 py-4 font-medium flex items-center whitespace-nowrap">
                                {mandi.isOptimal && <span className="w-2 h-2 rounded-full bg-mint mr-2 animate-pulse shadow-[0_0_8px_#20FFBD]"></span>}
                                {mandi.name}
                            </td>
                            <td className="px-6 py-4">{mandi.distanceKm} km</td>
                            <td className="px-6 py-4">₹{mandi.currentPrice}</td>
                            <td className={`px-6 py-4 font-bold ${mandi.isOptimal ? 'text-mint' : 'text-white'}`}>
                                ₹{mandi.netProfit.toLocaleString('en-IN')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-3 bg-white/5 border-t border-glass-border flex justify-end items-center">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center">
                    <svg className="w-3 h-3 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Live APMC Data from e-NAM
                </span>
            </div>
        </div>
    );
}
