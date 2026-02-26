'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/glass-card';
import { VoiceAssistant } from '@/components/voice-assistant';

export default function AgriVakeelPage() {
    const { t } = useLanguage();

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
            <header className="relative z-50 flex flex-col mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Agri-Vakeel AI</h1>
                <p className="text-sm text-gray-400">Your Personal AI Agricultural Consultant</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                <GlassCard className="p-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-mint/20 border-2 border-mint/40 flex items-center justify-center animate-pulse">
                            <span className="text-4xl font-black text-mint">AI</span>
                        </div>
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-bold text-white mb-4">How can I help you today?</h2>
                            <p className="text-gray-300 leading-relaxed">
                                I am powered by Groq and Llama 3 to help you understand market trends, spoilage risks, and profit-maximizing strategies in your regional language.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors">
                                <p className="text-xs text-mint font-bold uppercase mb-1">Market Insight</p>
                                <p className="text-sm text-gray-300 italic">"Why is nashik price dropping?"</p>
                            </button>
                            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors">
                                <p className="text-xs text-mint font-bold uppercase mb-1">Strategy</p>
                                <p className="text-sm text-gray-300 italic">"Should I wait 2 days to harvest?"</p>
                            </button>
                            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors">
                                <p className="text-xs text-mint font-bold uppercase mb-1">Weather Risk</p>
                                <p className="text-sm text-gray-300 italic">"Is there a rain spike tonight?"</p>
                            </button>
                            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors">
                                <p className="text-xs text-mint font-bold uppercase mb-1">Arbitrage</p>
                                <p className="text-sm text-gray-300 italic">"Which mandi gives most net profit?"</p>
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Note: The VoiceAssistant floating component is already available globally or via the Layout if we want to add it here too. 
                However, for a dedicated page, we might want to make it even more central.
                The current VoiceAssistant is a floating bubble. 
             */}
            <div className="flex justify-center mt-12">
                <p className="text-gray-500 text-sm italic font-medium">Use the floating AI bubble in the corner to start a conversation.</p>
            </div>
        </div>
    );
}
